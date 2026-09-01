"""
Roda o scraper localmente carregando scraper/.env — sem usar `source` do bash,
que quebra com valores JSON (vírgulas/chaves fazem o bash tentar interpretar
como comandos). Uso: python run_local.py
"""

import os

_ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")

if os.path.exists(_ENV_PATH):
    with open(_ENV_PATH, encoding="utf-8") as f:
        for linha in f:
            linha = linha.strip()
            if not linha or linha.startswith("#") or "=" not in linha:
                continue
            chave, _, valor = linha.partition("=")
            os.environ[chave] = valor

from main import main  # noqa: E402

if __name__ == "__main__":
    main()
