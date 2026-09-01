import os
import sys
from datetime import datetime, timezone

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
    configs = resposta.data or []

    if not configs:
        print("Nenhuma config ativa — nada a fazer.")
        return

    total_erros = 0

    for config in configs:
        erros_da_config = []
        total_anuncios = 0

        for fonte, buscar in BUSCADORES.items():
            try:
                resultados = buscar(config)
                total_anuncios += len(resultados)
                print(f'[{config["nome"]}] {fonte}: {len(resultados)} anúncios encontrados')

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
                        erros_da_config.append(f"{fonte}: erro ao gravar anúncio")
            except Exception as err:  # noqa: BLE001 — uma fonte falhando não pode derrubar a outra
                print(f'[{config["nome"]}] {fonte} falhou: {err}')
                erros_da_config.append(f"{fonte}: {err}")

        if erros_da_config:
            total_erros += len(erros_da_config)
            supabase.table("scraping_configs").update(
                {
                    "ultimo_erro": " | ".join(erros_da_config),
                    "ultimo_erro_em": datetime.now(timezone.utc).isoformat(),
                }
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
