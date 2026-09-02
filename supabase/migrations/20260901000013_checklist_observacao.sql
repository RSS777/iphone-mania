-- Campo de observação específico do checklist de avaliação, separado do
-- campo geral de observações do cadastro do iPhone.

alter table public.iphones
  add column if not exists observacao_checklist text;
