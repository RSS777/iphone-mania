"""
Filtro de data pro Garimpo — "postado ou editado na última semana".

O OLX mostra a data (que reflete a última atividade — postagem OU edição,
o site não distingue as duas) direto no card de busca ("Hoje, 11:08",
"Ontem, 15:00", "30 de ago, 14:15"), então dá pra filtrar com precisão.

O Facebook Marketplace NÃO mostra data nenhuma na tela de busca — só na
página de cada anúncio individual. Abrir cada anúncio pra checar a data
multiplicaria as requisições por busca (de 1 pra 40+) e o risco de a sessão
ser detectada como bot, então não filtramos por data no Facebook — os
resultados de lá continuam entrando sem esse filtro.
"""

import re
from datetime import datetime, timedelta

_MESES = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6,
    "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12,
}


def _parse_data_olx(texto: str, agora: datetime) -> datetime | None:
    texto = texto.strip()

    m = re.match(r"^(hoje|ontem),?\s*(\d{1,2}):(\d{2})$", texto, re.IGNORECASE)
    if m:
        dia_rel, hh, mm = m.groups()
        base = agora if dia_rel.lower() == "hoje" else agora - timedelta(days=1)
        return base.replace(hour=int(hh), minute=int(mm), second=0, microsecond=0)

    m = re.match(r"^(\d{1,2}) de (\w+),?\s*(\d{1,2}):(\d{2})$", texto, re.IGNORECASE)
    if m:
        dia, mes_txt, hh, mm = m.groups()
        mes = _MESES.get(mes_txt.lower()[:3])
        if not mes:
            return None
        try:
            data = datetime(agora.year, mes, int(dia), int(hh), int(mm))
        except ValueError:
            return None
        if data > agora:
            data = data.replace(year=agora.year - 1)
        return data

    return None


def olx_dentro_do_prazo(data_texto: str | None, dias: int = 7, agora: datetime | None = None) -> bool:
    """Regra rígida: sem conseguir confirmar que está dentro do prazo, descarta."""
    if not data_texto:
        return False
    agora = agora or datetime.now()
    data = _parse_data_olx(data_texto, agora)
    if data is None:
        return False
    return (agora - data) <= timedelta(days=dias)
