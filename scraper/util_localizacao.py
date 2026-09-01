import unicodedata


def _normalizar(texto: str) -> str:
    texto = texto.lower().strip()
    return "".join(c for c in unicodedata.normalize("NFD", texto) if unicodedata.category(c) != "Mn")


def bate_cidade(localizacao: str | None, cidades: list[str] | None) -> bool:
    """Sem cidades selecionadas, aceita qualquer localização (comportamento antigo).
    Com cidades selecionadas, só aceita se o texto da localização do anúncio
    contiver alguma delas — filtro rígido, não só rótulo visual."""
    if not cidades:
        return True
    if not localizacao:
        return False
    loc_norm = _normalizar(localizacao)
    return any(_normalizar(cidade) in loc_norm for cidade in cidades)
