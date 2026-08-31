# Issue tracker: GitHub

Issues e specs deste repo vivem como GitHub issues. Use a CLI `gh` para todas as operações.

## Convenções

- **Criar issue**: `gh issue create --title "..." --body "..."`. Use heredoc para corpos multi-linha.
- **Ler issue**: `gh issue view <number> --comments`, filtrando comentários com `jq` e também buscando labels.
- **Listar issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` com `--label` e `--state` apropriados.
- **Comentar em issue**: `gh issue comment <number> --body "..."`
- **Aplicar / remover labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Fechar**: `gh issue close <number> --comment "..."`

O repo é inferido de `git remote -v`; `gh` faz isso automaticamente dentro do clone.

## Pull requests como superfície de triagem

**PRs como superfície de request: não.** _(Mudar para `sim` se este repo tratar PRs externos como feature requests; `/triage` lê essa flag.)_

## Quando uma skill diz "publicar no rastreador de issues"

Criar uma issue no GitHub.

## Quando uma skill diz "buscar o ticket relevante"

Rodar `gh issue view <number> --comments`.

## Repositório

- Conta: RSS777
- Repo: `RSS777/iphone-mania` (privado)
