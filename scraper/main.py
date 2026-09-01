import os
import sys

from supabase import create_client
from buscar_olx import buscar_olx
from buscar_facebook import buscar_facebook_marketplace

BUSCADORES = {
    "olx": buscar_olx,
    "facebook": buscar_facebook_marketplace,
}


def main():
    url = os.environ.get("SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not service_key:
        print("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_KEY no ambiente.")
        sys.exit(1)

    supabase = create_client(url, service_key)

    resposta = supabase.table("scraping_configs").select("*").eq("ativo", True).order("created_at").execute()
    todas_configs = resposta.data or []

    if not todas_configs:
        print("Nenhuma config ativa — nada a fazer.")
        return

    # Enquanto testa (proxy/sessão em validação), processa só a config ativa mais
    # antiga por rodada, pra não estourar cota nem tomar bloqueio à toa. Pra rodar
    # todas de uma vez, troque configs = todas_configs.
    configs = todas_configs[:1]
    if len(todas_configs) > len(configs):
        print(f'{len(todas_configs)} configs ativas, processando só "{configs[0]["nome"]}" nessa rodada (limite de teste).')

    total_erros = 0

    for config in configs:
        buscar = BUSCADORES.get(config["fonte"])
        if buscar is None:
            print(f'[{config["nome"]}] fonte "{config["fonte"]}" não implementada — pulando.')
            continue

        try:
            resultados = buscar(config)
            print(f'[{config["nome"]}] {len(resultados)} anúncios encontrados')

            for anuncio in resultados:
                resp = supabase.rpc(
                    "processar_anuncio_scraping",
                    {
                        "p_config_id": config["id"],
                        "p_fonte": config["fonte"],
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
                    print(f'[{config["nome"]}] erro ao processar anúncio {anuncio["id"]}: {resp.error}')
                    total_erros += 1
        except Exception as err:  # noqa: BLE001 — precisa seguir pras próximas configs mesmo se uma falhar
            print(f'[{config["nome"]}] falhou: {err}')
            total_erros += 1

    if total_erros > 0:
        print(f"Finalizado com {total_erros} erro(s).")
        sys.exit(1)

    print("Finalizado sem erros.")


if __name__ == "__main__":
    main()
