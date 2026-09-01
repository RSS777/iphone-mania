-- Ticket #12: metas mensais de lucro (uma por mês, compartilhada entre os sócios).

create table if not exists public.metas_mensais (
  id uuid primary key default gen_random_uuid(),
  mes_referencia date not null unique, -- sempre o dia 1 do mês, ex: 2026-09-01
  meta_valor numeric(10, 2) not null check (meta_valor > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.metas_mensais enable row level security;

create policy "authenticated users can read metas_mensais"
  on public.metas_mensais for select
  to authenticated
  using (true);

create policy "authenticated users can insert metas_mensais"
  on public.metas_mensais for insert
  to authenticated
  with check (true);

create policy "authenticated users can update metas_mensais"
  on public.metas_mensais for update
  to authenticated
  using (true);

drop trigger if exists set_metas_mensais_updated_at on public.metas_mensais;
create trigger set_metas_mensais_updated_at
  before update on public.metas_mensais
  for each row execute function public.set_updated_at();
