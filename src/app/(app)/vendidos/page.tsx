import Link from "next/link";
import { NBGroup } from "@/components/nb/list";
import { VendidosIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import type { Iphone } from "@/lib/iphones";

type VendidosPageProps = {
  searchParams: Promise<{ modelo?: string; socio?: string; de?: string; ate?: string }>;
};

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDataBR(data: string | null) {
  if (!data) return "—";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export default async function VendidosPage({ searchParams }: VendidosPageProps) {
  const { modelo, socio, de, ate } = await searchParams;
  const supabase = await createClient();

  const { data: socios } = await supabase.from("profiles").select("id, nome, email").order("email");

  let query = supabase
    .from("iphones")
    .select("*, profiles!socio_responsavel_id(nome, email)")
    .eq("status", "vendido")
    .order("data_venda", { ascending: false });

  if (modelo) query = query.ilike("modelo", `%${modelo}%`);
  if (socio) query = query.eq("socio_responsavel_id", socio);
  if (de) query = query.gte("data_venda", de);
  if (ate) query = query.lte("data_venda", ate);

  const { data: vendidos } = await query.returns<Iphone[]>();
  const items = vendidos ?? [];

  const ids = items.map((i) => i.id);
  const { data: custos } =
    ids.length > 0
      ? await supabase.from("custos_adicionais").select("iphone_id, valor").in("iphone_id", ids)
      : { data: [] as { iphone_id: string; valor: number }[] };

  const custosPorIphone = new Map<string, number>();
  for (const c of custos ?? []) {
    custosPorIphone.set(c.iphone_id, (custosPorIphone.get(c.iphone_id) ?? 0) + Number(c.valor));
  }

  function lucro(iphone: Iphone) {
    const totalCustos = custosPorIphone.get(iphone.id) ?? 0;
    return Number(iphone.valor_venda ?? 0) - (Number(iphone.valor_compra ?? 0) + totalCustos);
  }

  function nomeSocio(iphone: Iphone) {
    const nome = iphone.profiles?.nome ?? iphone.profiles?.email ?? "—";
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  const temFiltro = Boolean(modelo || socio || de || ate);
  const lucroTotal = items.reduce((soma, i) => soma + lucro(i), 0);

  return (
    <div style={{ "--tint": "var(--nb-vendidos)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Vendidos
        </h1>
        {items.length > 0 ? (
          <p className="mt-1 text-[15px] text-[var(--nb-ink-secondary)]">
            Lucro do filtro{" "}
            <span className="font-bold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums]">
              {formatBRL(lucroTotal)}
            </span>
          </p>
        ) : null}
      </header>

      <main className="px-4 pb-6">
        <form method="get" className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
            <label
              htmlFor="modelo"
              className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
            >
              Modelo
            </label>
            <input
              id="modelo"
              name="modelo"
              defaultValue={modelo}
              placeholder="ex: iPhone 13"
              className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
            <label
              htmlFor="socio"
              className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
            >
              Sócio
            </label>
            <select
              id="socio"
              name="socio"
              defaultValue={socio ?? ""}
              className="mt-1 w-full appearance-none bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none"
            >
              <option value="">Todos</option>
              {(socios ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.nome ?? s.email).includes("@") ? s.email.split("@")[0] : s.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
              <label
                htmlFor="de"
                className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
              >
                Vendido de
              </label>
              <input
                id="de"
                name="de"
                type="date"
                defaultValue={de}
                className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none"
              />
            </div>
            <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
              <label
                htmlFor="ate"
                className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
              >
                até
              </label>
              <input
                id="ate"
                name="ate"
                type="date"
                defaultValue={ate}
                className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-1 flex items-center gap-4">
            <button
              type="submit"
              className="rounded-2xl px-4 py-3 text-[15px] font-bold text-[var(--nb-accent-ink)] active:opacity-70"
              style={{ backgroundColor: "var(--tint)" }}
            >
              Filtrar
            </button>
            {temFiltro ? (
              <Link href="/vendidos" className="text-[14px] font-semibold text-[var(--nb-ink-secondary)]">
                Limpar filtros
              </Link>
            ) : null}
          </div>
        </form>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <VendidosIcon className="h-12 w-12 text-[var(--nb-ink-tertiary)]" />
            <p className="text-[15px] text-[var(--nb-ink-secondary)]">
              {temFiltro ? "Nenhum item vendido bate com esse filtro." : "Nenhum iPhone vendido ainda."}
            </p>
          </div>
        ) : (
          <NBGroup>
            {items.map((iphone) => (
              <Link
                key={iphone.id}
                href={`/estoque/${iphone.id}`}
                className="block rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3 active:opacity-80"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-[15px] font-bold text-[var(--nb-ink)]">
                    {iphone.modelo} · {iphone.capacidade_gb}GB · {iphone.cor}
                  </p>
                  <p
                    className="shrink-0 text-[15px] font-bold [font-variant-numeric:tabular-nums]"
                    style={{ color: "var(--tint)" }}
                  >
                    {formatBRL(lucro(iphone))}
                  </p>
                </div>
                <p className="mt-1 text-[12.5px] text-[var(--nb-ink-tertiary)]">
                  comprado {formatDataBR(iphone.data_compra)} · vendido {formatDataBR(iphone.data_venda)} ·{" "}
                  {nomeSocio(iphone)}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">
                  compra {formatBRL(Number(iphone.valor_compra ?? 0))} + custos{" "}
                  {formatBRL(custosPorIphone.get(iphone.id) ?? 0)} · venda {formatBRL(Number(iphone.valor_venda ?? 0))}
                </p>
              </Link>
            ))}
          </NBGroup>
        )}
      </main>
    </div>
  );
}
