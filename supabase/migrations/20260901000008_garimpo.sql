-- Garimpo de iPhones (OLX): configs de busca + anúncios encontrados por scraping.

create table if not exists public.scraping_configs (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  fonte text not null default 'olx' check (fonte in ('olx', 'facebook')),
  termos_busca text not null,
  modelo text,
  preco_min numeric,
  preco_max numeric,
  localizacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.scraping_configs enable row level security;

create policy "authenticated users can read scraping_configs"
  on public.scraping_configs for select
  to authenticated
  using (true);

create policy "authenticated users can insert scraping_configs"
  on public.scraping_configs for insert
  to authenticated
  with check (true);

create policy "authenticated users can update scraping_configs"
  on public.scraping_configs for update
  to authenticated
  using (true);

create policy "authenticated users can delete scraping_configs"
  on public.scraping_configs for delete
  to authenticated
  using (true);

create table if not exists public.scraping_anuncios (
  id uuid primary key default gen_random_uuid(),
  config_id uuid references public.scraping_configs (id) on delete cascade,
  external_id text not null,
  fonte text not null default 'olx',
  titulo text,
  preco numeric,
  preco_anterior numeric,
  link text not null,
  descricao text,
  imagem_capa text,
  localizacao text,
  status text not null default 'novo' check (status in ('novo', 'visto', 'descartado', 'avaliado')),
  primeira_vez_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (fonte, external_id)
);

create index if not exists scraping_anuncios_status_idx on public.scraping_anuncios (status);
create index if not exists scraping_anuncios_fonte_external_id_idx on public.scraping_anuncios (fonte, external_id);

alter table public.scraping_anuncios enable row level security;

create policy "authenticated users can read scraping_anuncios"
  on public.scraping_anuncios for select
  to authenticated
  using (true);

-- Insert/update em scraping_anuncios acontece via a função abaixo (security definer,
-- chamada pelo scraper com a service_role key) — não precisa de policy de escrita pra
-- authenticated, mas o app precisa poder mudar o status (descartar/avaliar).
create policy "authenticated users can update scraping_anuncios"
  on public.scraping_anuncios for update
  to authenticated
  using (true);

create or replace function public.processar_anuncio_scraping(
  p_config_id uuid,
  p_fonte text,
  p_external_id text,
  p_titulo text,
  p_preco numeric,
  p_link text,
  p_descricao text,
  p_imagem text,
  p_localizacao text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existente public.scraping_anuncios%rowtype;
begin
  select * into v_existente from public.scraping_anuncios
    where fonte = p_fonte and external_id = p_external_id;

  if not found then
    insert into public.scraping_anuncios
      (config_id, fonte, external_id, titulo, preco, link, descricao, imagem_capa, localizacao)
    values
      (p_config_id, p_fonte, p_external_id, p_titulo, p_preco, p_link, p_descricao, p_imagem, p_localizacao);
  elsif v_existente.preco is not null and p_preco < v_existente.preco then
    update public.scraping_anuncios set
      preco_anterior = v_existente.preco,
      preco = p_preco,
      status = 'novo',
      atualizado_em = now()
    where id = v_existente.id;
  else
    update public.scraping_anuncios set atualizado_em = now() where id = v_existente.id;
  end if;
end;
$$;

-- Realtime: garante que a tabela emite eventos postgres_changes pro app assinar
-- (idempotente — não falha se a tabela já estiver na publicação).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'scraping_anuncios'
  ) then
    alter publication supabase_realtime add table public.scraping_anuncios;
  end if;
end;
$$;
