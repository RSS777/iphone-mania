-- Garimpo: com muitas buscas ativas, processar todas numa rodada só passou de
-- 25-30min (o OLX/Cloudflare é lento pra resolver por busca) — mais que o
-- intervalo do próprio cron (20min), fazendo o GitHub Actions atrasar/pular
-- rodadas inteiras. Agora processa um lote pequeno por vez, em rodízio: essa
-- coluna guarda quando cada busca foi processada por último, pra sempre pegar
-- as mais "atrasadas" primeiro.

alter table public.scraping_configs
  add column if not exists ultima_execucao_em timestamptz;
