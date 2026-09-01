-- Ticket #4: checklist, custos adicionais, fotos e valor/data de compra.

alter table public.iphones
  add column if not exists valor_compra numeric(10, 2),
  add column if not exists data_compra date,
  add column if not exists checklist jsonb not null default '{}'::jsonb;

create table if not exists public.custos_adicionais (
  id uuid primary key default gen_random_uuid(),
  iphone_id uuid not null references public.iphones (id) on delete cascade,
  descricao text not null,
  valor numeric(10, 2) not null,
  data date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.custos_adicionais enable row level security;

create policy "authenticated users can read custos_adicionais"
  on public.custos_adicionais for select
  to authenticated
  using (true);

create policy "authenticated users can insert custos_adicionais"
  on public.custos_adicionais for insert
  to authenticated
  with check (true);

create policy "authenticated users can update custos_adicionais"
  on public.custos_adicionais for update
  to authenticated
  using (true);

create policy "authenticated users can delete custos_adicionais"
  on public.custos_adicionais for delete
  to authenticated
  using (true);

create table if not exists public.iphone_fotos (
  id uuid primary key default gen_random_uuid(),
  iphone_id uuid not null references public.iphones (id) on delete cascade,
  path text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.iphone_fotos enable row level security;

create policy "authenticated users can read iphone_fotos"
  on public.iphone_fotos for select
  to authenticated
  using (true);

create policy "authenticated users can insert iphone_fotos"
  on public.iphone_fotos for insert
  to authenticated
  with check (true);

create policy "authenticated users can delete iphone_fotos"
  on public.iphone_fotos for delete
  to authenticated
  using (true);

-- bucket de storage pras fotos dos iPhones: leitura pública (fotos não são
-- dado sensível), escrita restrita a usuários autenticados.
insert into storage.buckets (id, name, public)
values ('iphone-fotos', 'iphone-fotos', true)
on conflict (id) do nothing;

create policy "anyone can view iphone photos"
  on storage.objects for select
  to public
  using (bucket_id = 'iphone-fotos');

create policy "authenticated users can upload iphone photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'iphone-fotos');

create policy "authenticated users can delete iphone photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'iphone-fotos');
