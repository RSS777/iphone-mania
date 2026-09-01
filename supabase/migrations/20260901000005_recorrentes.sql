-- Ticket #10: saídas recorrentes.

create table if not exists public.saidas_recorrentes (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric(10, 2) not null check (valor > 0),
  categoria_id uuid not null references public.categorias_saida (id),
  frequencia text not null default 'mensal' check (frequencia in ('mensal')),
  dia_vencimento integer not null check (dia_vencimento between 1 and 28),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.saidas_recorrentes enable row level security;

create policy "authenticated users can read saidas_recorrentes"
  on public.saidas_recorrentes for select
  to authenticated
  using (true);

create policy "authenticated users can insert saidas_recorrentes"
  on public.saidas_recorrentes for insert
  to authenticated
  with check (true);

create policy "authenticated users can update saidas_recorrentes"
  on public.saidas_recorrentes for update
  to authenticated
  using (true);

alter table public.lancamentos_caixa
  add column if not exists saida_recorrente_id uuid references public.saidas_recorrentes (id);

-- garante idempotência: o job de geração diária não cria 2 lançamentos pra
-- mesma recorrência na mesma data, mesmo se rodar mais de uma vez no dia.
create unique index if not exists lancamentos_caixa_recorrencia_data_unique
  on public.lancamentos_caixa (saida_recorrente_id, data)
  where (saida_recorrente_id is not null);
