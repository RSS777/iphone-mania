-- Garimpo: cada busca agora pesquisa OLX e Facebook Marketplace juntos —
-- a coluna "fonte" deixa de fazer sentido em scraping_configs (o anúncio em
-- si, scraping_anuncios.fonte, continua guardando de qual site ele veio).

alter table public.scraping_configs
  drop column if exists fonte;
