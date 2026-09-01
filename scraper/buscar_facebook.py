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
import os
import re
from urllib.parse import quote
from scrapling.fetchers import StealthyFetcher

# O Cookie-Editor exporta num formato próprio (expirationDate, sameSite em
# minúsculo/"no_restriction") diferente do que o Playwright espera
# (expires, sameSite "Strict"/"Lax"/"None"). Sem essa conversão o Scrapling
# rejeita os cookies com "Invalid enum value 'lax'".
_SAME_SITE_MAP = {
    "no_restriction": "None",
    "lax": "Lax",
    "strict": "Strict",
    "unspecified": "None",
}


def _converter_cookie(c: dict) -> dict:
    convertido = {
        "name": c["name"],
        "value": c["value"],
        "domain": c["domain"],
        "path": c.get("path", "/"),
        "httpOnly": bool(c.get("httpOnly", False)),
        "secure": bool(c.get("secure", False)),
    }
    if not c.get("session") and c.get("expirationDate"):
        convertido["expires"] = c["expirationDate"]
    same_site = (c.get("sameSite") or "").lower()
    if same_site in _SAME_SITE_MAP:
        convertido["sameSite"] = _SAME_SITE_MAP[same_site]
    return convertido


def _cookies_do_ambiente():
    bruto = os.environ.get("FACEBOOK_COOKIES_JSON")
    if not bruto:
        raise RuntimeError(
            "FACEBOOK_COOKIES_JSON não configurado — exporte os cookies da sua sessão logada do Facebook."
        )
    return [_converter_cookie(c) for c in json.loads(bruto)]


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

        # O aria-label do Facebook vem no formato
        # "{título}, R$ {preço},  {cidade}, {UF}, classificado {id}" — limpa
        # o preço e o sufixo do id, depois separa cidade/UF do resto do título.
        sem_preco = re.sub(r"R\$\s*[\d.,]+", "", base_texto)
        sem_id = re.sub(r",?\s*classificado\s+\d+\s*$", "", sem_preco, flags=re.IGNORECASE)
        partes = [p.strip() for p in sem_id.split(",") if p.strip()]

        localizacao = None
        titulo = sem_id.strip(" -,")
        if len(partes) >= 3 and re.fullmatch(r"[A-Za-zÀ-ÿ]{2}", partes[-1]):
            localizacao = f"{partes[-2]}, {partes[-1]}"
            titulo = ", ".join(partes[:-2]).strip(" -,")

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
                "localizacao": localizacao or config.get("localizacao"),
            }
        )

    return resultados
