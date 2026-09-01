-- Ticket #7: venda de iPhone + lucro automático (operação atômica).

alter table public.iphones
  add column if not exists valor_venda numeric(10, 2),
  add column if not exists data_venda date,
  add column if not exists canal_venda text;

-- o lançamento automático de venda pode ser negativo (venda com prejuízo) ou zero;
-- só os lançamentos manuais continuam validados como positivos, na camada de aplicação.
alter table public.lancamentos_caixa drop constraint if exists lancamentos_caixa_valor_check;
alter table public.lancamentos_caixa add constraint lancamentos_caixa_valor_check check (valor <> 0);

create or replace function public.registrar_venda(
  p_iphone_id uuid,
  p_valor_venda numeric,
  p_data_venda date,
  p_canal_venda text
)
returns void
language plpgsql
security invoker
as $$
declare
  v_status text;
  v_valor_compra numeric;
  v_custos numeric;
  v_lucro numeric;
  v_modelo text;
begin
  select status, coalesce(valor_compra, 0), modelo
    into v_status, v_valor_compra, v_modelo
  from public.iphones
  where id = p_iphone_id
  for update;

  if not found then
    raise exception 'iphone_nao_encontrado';
  end if;

  if v_status <> 'a_venda' then
    raise exception 'status_invalido';
  end if;

  select coalesce(sum(valor), 0) into v_custos
  from public.custos_adicionais
  where iphone_id = p_iphone_id;

  v_lucro := p_valor_venda - (v_valor_compra + v_custos);

  update public.iphones
  set valor_venda = p_valor_venda,
      data_venda = p_data_venda,
      canal_venda = p_canal_venda,
      status = 'vendido'
  where id = p_iphone_id;

  if v_lucro <> 0 then
    insert into public.lancamentos_caixa (tipo, descricao, valor, data, origem, iphone_id)
    values ('entrada', 'Venda: ' || v_modelo, v_lucro, p_data_venda, 'venda_iphone', p_iphone_id);
  end if;
end;
$$;
