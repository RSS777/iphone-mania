"""
Busca no Facebook Marketplace via Scrapling, usando a sessão (cookies) da sua
própria conta — o Marketplace não tem versão pública sem login.

ATENÇÃO — precisa de validação com sessão real antes de considerar pronto:
o Facebook não usa classes CSS estáveis tipo o OLX (são nomes gerados, mudam a
cada build). Por isso a extração aqui é feita pelo padrão mais estável que
existe — o link `/marketplace/item/<id>/` e o `aria-label` do card — em vez de
classe CSS. Ainda assim, confira contra uma busca real (F12 → Elements) antes
de considerar essa parte pronta; ajuste os seletores abaixo se vier vazio.
"""

import json
import re
from urllib.parse import quote
from scrapling.fetchers import StealthyFetcher


def _cookies_do_ambiente():
    bruto = __import__("os").environ.get("FACEBOOK_COOKIES_JSON")
    if not bruto:
        raise RuntimeError(
            "FACEBOOK_COOKIES_JSON não configurado — exporte os cookies da sua sessão logada do Facebook."
        )
    return json.loads(bruto)


def buscar_facebook_marketplace(config: dict) -> list[dict]:
    termos = config["termos_busca"]
    url = f"https://www.facebook.com/marketplace/search/?query={quote(termos)}"

    cookies = _cookies_do_ambiente()
    page = StealthyFetcher.fetch(url, headless=True, cookies=cookies, network_idle=True, timeout=45000)

    if page.status != 200:
        raise RuntimeError(f'Facebook Marketplace respondeu {page.status} pra "{termos}"')

    if "login" in str(page.url).lower():
        raise RuntimeError("A sessão do Facebook expirou (redirecionou pro login) — exporte os cookies de novo.")

    preco_min = config.get("preco_min") or 0
    preco_max = config.get("preco_max") or float("inf")
    resultados = []
    vistos = set()

    for link_el in page.css('a[href*="/marketplace/item/"]'):
        href = link_el.attrib.get("href", "")
        match = re.search(r"/marketplace/item/(\d+)", href)
        if not match:
            continue
        external_id = match.group(1)
        if external_id in vistos:
            continue
        vistos.add(external_id)

        aria = (link_el.attrib.get("aria-label") or "").strip()
        texto_completo = "".join(link_el.css("::text").getall()).strip()
        base_texto = aria or texto_completo

        preco_match = re.search(r"R\$\s*([\d.,]+)", base_texto)
        preco = None
        if preco_match:
            digitos = re.sub(r"\D", "", preco_match.group(1))
            preco = int(digitos) if digitos else None

        titulo = re.sub(r"R\$\s*[\d.,]+", "", base_texto).strip(" -")

        img_el = link_el.css("img")
        imagem = img_el[0].attrib.get("src") if img_el else None

        link_absoluto = href if href.startswith("http") else f"https://www.facebook.com{href}"

        if not preco:
            continue
        if preco < preco_min or preco > preco_max:
            continue

        resultados.append(
            {
                "id": external_id,
                "titulo": titulo,
                "preco": preco,
                "link": link_absoluto,
                "imagem": imagem,
                "descricao": "",
                "localizacao": config.get("localizacao"),
            }
        )

    return resultados
