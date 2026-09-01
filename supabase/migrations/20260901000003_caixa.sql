-- Ticket #5: fluxo de caixa base (categorias de saída, lançamentos manuais, saldo).

create table if not exists public.categorias_saida (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categorias_saida enable row level security;

create policy "authenticated users can read categorias_saida"
  on public.categorias_saida for select
  to authenticated
  using (true);

create policy "authenticated users can insert categorias_saida"
  on public.categorias_saida for insert
  to authenticated
  with check (true);

create policy "authenticated users can update categorias_saida"
  on public.categorias_saida for update
  to authenticated
  using (true);

create table if not exists public.lancamentos_caixa (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('entrada', 'saida')),
  categoria_id uuid references public.categorias_saida (id),
  descricao text not null,
  valor numeric(10, 2) not null check (valor > 0),
  data date not null default current_date,
  origem text not null default 'manual' check (origem in ('manual', 'venda_iphone', 'recorrencia')),
  iphone_id uuid references public.iphones (id),
  socio_id uuid not null references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now(),
  constraint saida_precisa_de_categoria check (tipo = 'entrada' or categoria_id is not null)
);

alter table public.lancamentos_caixa enable row level security;

create policy "authenticated users can read lancamentos_caixa"
  on public.lancamentos_caixa for select
  to authenticated
  using (true);

create policy "authenticated users can insert lancamentos_caixa"
  on public.lancamentos_caixa for insert
  to authenticated
  with check (true);

create policy "authenticated users can update lancamentos_caixa"
  on public.lancamentos_caixa for update
  to authenticated
  using (true);

create policy "authenticated users can delete lancamentos_caixa"
  on public.lancamentos_caixa for delete
  to authenticated
  using (true);

insert into public.categorias_saida (nome)
select nome from (values
  ('Salário sócio 1'),
  ('Salário sócio 2'),
  ('Manutenção'),
  ('Outros serviços')
) as seed(nome)
where not exists (select 1 from public.categorias_saida);
