import unicodedata


def _normalizar(texto: str) -> str:
    texto = texto.lower().strip()
    return "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn")


def bate_cidade(localizacao: str | None, cidades: list[str] | None) -> bool:
    """Sem cidades selecionadas, aceita qualquer localização (comportamento antigo).
    Com cidades selecionadas, só aceita se o texto da localização do anúncio
    contiver TODAS as partes de alguma cidade escolhida (cidade e UF separados,
    já que "Salvador, BA" vem no chip mas o site pode escrever "Salvador -  BA"
    ou "Salvador/BA" — não dá pra exigir a string exata) — filtro rígido, é
    regra: nunca deixa passar anúncio fora das cidades escolhidas."""
    if not cidades:
        return True
    if not localizacao:
        return False
    loc_norm = _normalizar(localizacao)
    for cidade in cidades:
        partes = [p.strip() for p in cidade.split(",") if p.strip()]
        if partes and all(_normalizar(p) in loc_norm for p in partes):
            return True
    return False
