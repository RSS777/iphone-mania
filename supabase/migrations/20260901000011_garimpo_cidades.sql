-- Garimpo: troca o campo livre "localizacao" por uma lista de cidades
-- selecionadas, usada como filtro rígido no scraper (não só rótulo visual).

alter table public.scraping_configs
  drop column if exists localizacao,
  add column if not exists cidades text[] not null default '{}';
