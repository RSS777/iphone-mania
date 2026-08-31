# Docs de Domínio

Como as skills de engenharia devem consumir a documentação de domínio deste repo ao explorar o código.

## Antes de explorar, leia isto

- **`CONTEXT.md`** na raiz do repo, ou
- **`CONTEXT-MAP.md`** na raiz do repo, se existir: aponta para um `CONTEXT.md` por contexto. Leia cada um relevante ao tópico.
- **`docs/adr/`**: leia ADRs que tocam a área em que você vai mexer.

Se algum desses arquivos não existir, **prossiga em silêncio**. Não sinalize a ausência; não sugira criá-los antecipadamente.

## Estrutura de arquivos

Repo single-context (este projeto):

```
/
├── CONTEXT.md
├── docs/adr/
└── src/ (ou app/, conforme o setup do Next.js)
```

## Use o vocabulário do glossário

Quando a saída nomear um conceito de domínio (título de issue, proposta de refactor, hipótese, nome de teste), use o termo como definido em `CONTEXT.md`. Não derive para sinônimos que o glossário evita explicitamente.

## Sinalize conflitos com ADR

Se a saída contradizer um ADR existente, sinalize explicitamente em vez de sobrescrever silenciosamente.
