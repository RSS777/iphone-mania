---
version: 1
slug: "login"
primary_target: "login"
related_targets: []
---

# Surface: Login (ticket #2)

## Escopo e modo
Tela única de autenticação (email/senha), modo Operate. Primeira superfície visual construída no produto — estabelece o mundo visual do app inteiro (a ser documentado em DESIGN.md no build).

## Público, tarefa, ação/prova, restrições
Os 2 sócios, sempre em dispositivo pessoal, logando antes de qualquer tarefa (avaliação em campo ou consulta do caixa). Ação primária: autenticar. Prova de sucesso: sessão iniciada, redireciona pro app. "Esqueci minha senha" sempre visível como caminho secundário. Sem tela de criar conta.

## Direção escolhida — Ordem de Serviço de Bancada
- Mundo: ordem de serviço de assistência técnica — a primeira via de um talão preenchido e carimbado antes do trabalho começar.
- Tese: logar é abrir a ordem de serviço do dia; a mesma linguagem visual carrega o checklist de avaliação (tickets #3/#4) depois, plantando a identidade do app já na primeira tela.
- Paleta: papel #f2f0ea, tinta quase-preta #22201c, verde-carimbo #3a6b52, vermelho-errata #c9463c (reservado só pra erro/alerta, nunca decorativo).
- Materiais: papel carbono, prancheta metálica, carimbo de tinta, clipe de metal.
- Primeiro viewport: cabeçalho com canto rasgado de talão; email/senha como linhas pautadas tipo checklist; botão de entrar é um carimbo "ENTRAR" batido na página.
- Risco assumido: leitura mais literal para um app com checklist — mitigado com craft real (textura de carbono, imperfeição de tinta, corte rasgado real), não um reskin raso.

## Momento memorável
O carimbo "ENTRAR" reagindo como um carimbo real batendo na página no submit — não um botão genérico com spinner.

## Decisões em aberto
- Tipografia exata e ícones ficam pro build.
- Nenhum logo gráfico definido — cabeçalho carrega só o nome "iPhone Mania" tipografado.
- Esta direção deve se repetir nas próximas telas; não é exclusiva do login.
