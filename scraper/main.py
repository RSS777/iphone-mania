import os
import random
import sys
import time
from datetime import datetime, timezone

from supabase import create_client
from buscar_olx import buscar_olx

# Facebook Marketplace removido do pipeline — a sessão derrubava com muita
# frequência (o GitHub Actions troca de IP a cada execução, padrão que o
# Facebook trata como sequestro de sessão) e virou fonte constante de erro.
# Só OLX por enquanto.
BUSCADORES = {"olx": buscar_olx}

# Com muitas buscas ativas, processar todas numa rodada só passava de
# 25-30min — mais que o intervalo do próprio cron (20min), o que fazia o
# GitHub Actions atrasar/pular rodadas inteiras (confirmado: o cron ficou
# 3h+ sem disparar). Agora processa só um lote pequeno por vez, sempre as
# buscas que estão há mais tempo sem rodar (rodízio) — cobre todas ao longo
# de várias execuções, sem nenhuma rodada estourar o tempo do cron.
TAMANHO_LOTE = int(os.environ.get("GARIMPO_TAMANHO_LOTE", "3"))


def _erros_por_fonte(texto_erro: str | None) -> dict[str, str]:
    """'olx: X | facebook: Y' -> {'olx': 'X', 'facebook': 'Y'}"""
    if not texto_erro:
        return {}
    partes: dict[str, str] = {}
    for trecho in texto_erro.split(" | "):
        fonte, _, msg = trecho.partition(": ")
        if fonte:
            partes[fonte.strip()] = msg.strip()
    return partes


def main():
    url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not service_key:
        print("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_KEY no ambiente.")
        sys.exit(1)

    supabase = create_client(url, service_key)

    resposta = (
        supabase.table("scraping_configs")
        .select("*")
        .eq("ativo", True)
        .order("ultima_execucao_em", desc=False, nullsfirst=True)
        .execute()
    )
    todas_configs = resposta.data or []

    if not todas_configs:
        print("Nenhuma config ativa — nada a fazer.")
        return

    configs = todas_configs[:TAMANHO_LOTE]
    if len(todas_configs) > len(configs):
        nomes_resto = ", ".join(c["nome"] for c in todas_configs[len(configs) :])
        print(f"{len(todas_configs)} buscas ativas, processando {len(configs)} nessa rodada (rodízio).")
        print(f"Ficam pra próxima(s) rodada(s): {nomes_resto}")

    total_erros = 0

    for indice, config in enumerate(configs):
        # Disparar tudo em sequência rápida contra o Cloudflare do OLX vindo
        # do mesmo IP levanta suspeita — espaça as requisições (com jitter,
        # não um intervalo fixo/previsível) pra parecer navegação normal.
        if indice > 0:
            pausa = random.uniform(15, 30)
            print(f"— pausa de {pausa:.1f}s antes da próxima busca —")
            time.sleep(pausa)

        erros_atuais = _erros_por_fonte(config.get("ultimo_erro"))

        for fonte, buscar in BUSCADORES.items():
            try:
                resultados = buscar(config)
                print(f'[{config["nome"]}] {fonte}: {len(resultados)} anúncios encontrados')
                erros_atuais.pop(fonte, None)

                for anuncio in resultados:
                    resp = supabase.rpc(
                        "processar_anuncio_scraping",
                        {
                            "p_config_id": config["id"],
                            "p_fonte": fonte,
                            "p_external_id": anuncio["id"],
                            "p_titulo": anuncio["titulo"],
                            "p_preco": anuncio["preco"],
                            "p_link": anuncio["link"],
                            "p_descricao": anuncio["descricao"],
                            "p_imagem": anuncio["imagem"],
                            "p_localizacao": anuncio["localizacao"],
                        },
                    ).execute()
                    if getattr(resp, "error", None):
                        print(f'[{config["nome"]}] {fonte}: erro ao processar anúncio {anuncio["id"]}: {resp.error}')
                        erros_atuais[fonte] = "erro ao gravar anúncio"
            except Exception as err:  # noqa: BLE001 — uma fonte falhando não pode derrubar a outra
                print(f'[{config["nome"]}] {fonte} falhou: {err}')
                erros_atuais[fonte] = str(err)

        agora = datetime.now(timezone.utc).isoformat()
        atualizacao = {"ultima_execucao_em": agora}
        if erros_atuais:
            total_erros += len(erros_atuais)
            atualizacao["ultimo_erro"] = " | ".join(f"{f}: {m}" for f, m in erros_atuais.items())
            atualizacao["ultimo_erro_em"] = agora
        elif config.get("ultimo_erro"):
            atualizacao["ultimo_erro"] = None
            atualizacao["ultimo_erro_em"] = None
        supabase.table("scraping_configs").update(atualizacao).eq("id", config["id"]).execute()

    if total_erros > 0:
        print(f"Finalizado com {total_erros} erro(s).")
        sys.exit(1)

    print("Finalizado sem erros.")


if __name__ == "__main__":
    main()
