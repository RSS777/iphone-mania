-- Ticket #10: lançamentos gerados pelo cron de recorrentes não têm um sócio
-- humano por trás (rodam com a service_role, sem sessão de usuário) — socio_id
-- null representa "gerado pelo sistema".
alter table public.lancamentos_caixa alter column socio_id drop not null;
