"""
Busca no OLX via Scrapling (StealthyFetcher — navegador real disfarçado).

O OLX roda atrás do Cloudflare, que bloqueia requisição HTTP simples (mesmo com
User-Agent de navegador) vinda de IP de datacenter. O StealthyFetcher do Scrapling
resolve o desafio JS do Cloudflare de verdade — testado e confirmado funcionando
tanto local quanto no runner do GitHub Actions.
"""

from urllib.parse import quote
from scrapling.fetchers import StealthyFetcher
from util_localizacao import bate_cidade


def _texto(selector_list):
    if not selector_list:
        return ""
    return "".join(selector_list[0].css("::text").getall()).strip()


def buscar_olx(config: dict) -> list[dict]:
    termos = config["termos_busca"]
    url = f"https://www.olx.com.br/celulares/celulares-e-smartphones?q={quote(termos)}"

    page = StealthyFetcher.fetch(url, headless=True, solve_cloudflare=True, network_idle=True)
    if page.status != 200:
        raise RuntimeError(f'OLX respondeu {page.status} pra "{termos}"')

    preco_min = config.get("preco_min") or 0
    preco_max = config.get("preco_max") or float("inf")
    cidades = config.get("cidades") or []
    resultados = []

    for card in page.css(".olx-adcard"):
        link_el = card.css('[data-testid="adcard-link"]')
        if not link_el:
            continue
        link = link_el[0].attrib.get("href")
        if not link:
            continue

        titulo = _texto(link_el[0].css(".olx-adcard__title")) or (link_el[0].attrib.get("title") or "").strip()

        preco_texto = _texto(card.css(".olx-adcard__price"))
        digitos = "".join(c for c in preco_texto if c.isdigit())
        preco = int(digitos) if digitos else None

        localizacao = _texto(card.css(".olx-adcard__location"))

        img_el = card.css(".olx-adcard__media img")
        imagem = img_el[0].attrib.get("src") if img_el else None

        external_id = link.rstrip("/").split("-")[-1].split("?")[0]
        if not external_id or not preco:
            continue
        if preco < preco_min or preco > preco_max:
            continue
        if not bate_cidade(localizacao, cidades):
            continue

        resultados.append(
            {
                "id": external_id,
                "titulo": titulo,
                "preco": preco,
                "link": link,
                "imagem": imagem,
                "descricao": "",
                "localizacao": localizacao or None,
            }
        )

    return resultados
