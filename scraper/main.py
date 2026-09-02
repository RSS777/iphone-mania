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

    resposta = supabase.table("scraping_configs").select("*").eq("ativo", True).order("created_at").execute()
    configs = resposta.data or []

    if not configs:
        print("Nenhuma config ativa — nada a fazer.")
        return

    total_erros = 0

    for indice, config in enumerate(configs):
        # Com várias configs ativas, disparar tudo em sequência rápida contra
        # o Cloudflare do OLX vindo do mesmo IP levanta suspeita — foi o que
        # aconteceu: maioria "0 anúncios" e a última com 404. Espaça as
        # requisições (com jitter, não um intervalo fixo/previsível) pra
        # parecer navegação normal, não scraping em rajada.
        if indice > 0:
            pausa = random.uniform(8, 18)
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

        if erros_atuais:
            total_erros += len(erros_atuais)
            texto = " | ".join(f"{f}: {m}" for f, m in erros_atuais.items())
            supabase.table("scraping_configs").update(
                {"ultimo_erro": texto, "ultimo_erro_em": datetime.now(timezone.utc).isoformat()}
            ).eq("id", config["id"]).execute()
        elif config.get("ultimo_erro"):
            supabase.table("scraping_configs").update({"ultimo_erro": None, "ultimo_erro_em": None}).eq(
                "id", config["id"]
            ).execute()

    if total_erros > 0:
        print(f"Finalizado com {total_erros} erro(s).")
        sys.exit(1)

    print("Finalizado sem erros.")


if __name__ == "__main__":
    main()
