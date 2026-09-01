-- Garimpo: registra o último erro de cada busca (ex: sessão do Facebook
-- expirada), pra avisar o usuário direto no app em vez de só no log do
-- GitHub Actions.

alter table public.scraping_configs
  add column if not exists ultimo_erro text,
  add column if not exists ultimo_erro_em timestamptz;
