# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), hospedado na Vercel; Supabase (Postgres + Auth + Storage) como backend. PWA instalável (manifest.json + service worker).

## Users

Os 2 sócios de um negócio de compra e revenda de iPhones usados. Ambos têm acesso admin igual, sem diferenciação de permissões — cada um pode criar, editar e excluir qualquer dado, inclusive registros criados pelo outro. Usam o app principalmente pelo celular, muitas vezes durante a avaliação de um iPhone no ato da compra, fora do escritório.

## Product Purpose

Gerenciar o ciclo completo de compra, avaliação, custos, venda e fluxo de caixa do negócio: cadastrar e avaliar um iPhone antes de comprar, acompanhar custos adicionais até a venda, calcular e lançar o lucro automaticamente no caixa do negócio, e dar visibilidade consolidada (lucro por período, metas mensais, saldo de caixa) pros 2 sócios tomarem decisão.

## Positioning

Um app único e compartilhado que une, num só lugar, o checklist de avaliação pré-compra, o custo real de cada aparelho (compra + reparos/acessórios), o cálculo automático de lucro na venda, e o fluxo de caixa do negócio (incluindo despesas recorrentes automáticas) — eliminando planilhas soltas ou controle mental entre os 2 sócios.

## Operating Context

- Avaliação de iPhone acontece no momento da compra, tipicamente fora do escritório/casa (rua, encontro com vendedor), por isso o uso mobile é o caso primário.
- Fluxo do item: Avaliando → Comprado → Em preparação → À venda → Vendido, com avanço manual de status decidido pelo sócio (exceto a transição final pra "Vendido", automática ao preencher valor de venda).
- Controle financeiro do negócio inclui entradas automáticas (lucro de venda) e manuais (aportes, outras receitas), saídas manuais categorizadas, e saídas recorrentes (ex: salário dos sócios) lançadas automaticamente todo mês.
- Uso é privado entre os 2 sócios — sem clientes ou terceiros acessando o sistema.

## Capabilities and Constraints

- Login restrito aos 2 sócios via Supabase Auth (email/senha), sem cadastro público. Sessão persiste no PWA.
- RLS restrita aos 2 usuários autenticados; nenhuma rota de dados pública.
- IMEI é único apenas entre iPhones ativos (não vendidos) — recompra do mesmo IMEI após venda é permitida.
- Checklist de avaliação é informativo, nunca bloqueia o fluxo.
- Ao menos 1 foto é obrigatória antes de um iPhone poder ir para o status "À venda".
- Lucro do item = valor de venda − (valor de compra + soma dos custos adicionais); gerado como lançamento automático de entrada no caixa no momento da venda.
- Meta mensal é um único valor de lucro (R$) compartilhado pelo negócio — sem meta por sócio nem meta de quantidade.
- Exclusão de lançamentos (incluindo os gerados automaticamente por recorrência) é definitiva — sem histórico de auditoria.
- Escrita (criar/editar/excluir) exige internet; leitura de dados já carregados funciona offline.
- Sem notificações push nesta versão — avisos aparecem só dentro do app.
- Sem multi-idioma — app é pt-BR only.

## Brand Commitments

- Nome do produto/negócio: **iPhone Mania**.
- Nenhum logo, paleta ou identidade visual definidos ainda — a ser resolvido em trabalho de design futuro (new-work), não neste documento.

## Evidence on Hand

- Nenhum conteúdo real (fotos de iPhones, dados de vendas, histórico de caixa) existe ainda — é um produto novo, sem dados de produção. Trabalho futuro não deve inventar vendas, valores ou depoimentos de exemplo como se fossem reais.
- Spec técnico completo e tickets de implementação já publicados no GitHub: `RSS777/iphone-mania`, issue #1 (spec) e issues #2–#13 (tickets vertical-slice em ordem de dependência).

## Product Principles

1. **Mobile primeiro, sempre.** A avaliação de compra acontece na rua — toda tela crítica do fluxo de compra precisa funcionar bem numa mão só, num celular, possivelmente com sinal ruim.
2. **Confiança entre os 2 sócios acima de controle de acesso.** Nenhuma trava de permissão entre os sócios; o design deve mostrar responsabilidade (quem fez o quê) sem impedir o outro de agir.
3. **Automação reduz erro financeiro.** Cálculo de lucro e lançamento de caixa nunca dependem de digitação manual repetida — o sistema deriva e lança sozinho sempre que possível.
4. **Checklist orienta, não bloqueia.** Ferramentas de apoio à decisão (checklist, avisos) informam o sócio, mas a decisão final de negócio é sempre humana.
5. **Sem enfeite sem dado real.** Nenhuma tela deve fingir ter histórico, vendas ou metas que não existem — estados vazios são o padrão inicial esperado.

## Accessibility & Inclusion

Nenhum requisito específico de acessibilidade foi levantado além dos padrões básicos esperados de um PWA (contraste, alvos de toque adequados para uso mobile com uma mão).
