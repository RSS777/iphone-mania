-- Ticket #3: cadastro básico de iPhone em avaliação.

create table if not exists public.iphones (
  id uuid primary key default gen_random_uuid(),
  modelo text not null,
  capacidade_gb integer not null,
  cor text not null,
  imei text not null,
  status text not null default 'avaliando'
    check (status in ('avaliando', 'comprado', 'preparacao', 'a_venda', 'vendido')),
  origem_compra text not null,
  observacoes text,
  socio_responsavel_id uuid not null references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- IMEI só precisa ser único entre itens ainda não vendidos; um IMEI vendido pode
-- ser recadastrado depois (recompra legítima do mesmo aparelho).
create unique index if not exists iphones_imei_active_unique
  on public.iphones (imei)
  where (status <> 'vendido');

alter table public.iphones enable row level security;

create policy "authenticated users can read iphones"
  on public.iphones for select
  to authenticated
  using (true);

create policy "authenticated users can insert iphones"
  on public.iphones for insert
  to authenticated
  with check (true);

create policy "authenticated users can update iphones"
  on public.iphones for update
  to authenticated
  using (true);

create policy "authenticated users can delete iphones"
  on public.iphones for delete
  to authenticated
  using (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_iphones_updated_at on public.iphones;
create trigger set_iphones_updated_at
  before update on public.iphones
  for each row execute function public.set_updated_at();
