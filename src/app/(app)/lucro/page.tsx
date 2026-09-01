import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/caixa";
import { dataISOHaMeses, hojeISO } from "@/lib/lucro";
import { LucroChart } from "./lucro-chart";

type LucroPageProps = {
  searchParams: Promise<{ de?: string; ate?: string }>;
};

export default async function LucroPage({ searchParams }: LucroPageProps) {
  const { de, ate } = await searchParams;
  const supabase = await createClient();

  const [{ data: vendasEntradas }, { data: vendidos }, { data: entradasPeriodo }] = await Promise.all([
    // lucro total acumulado: todas as vendas, sem filtro de período.
    supabase.from("lancamentos_caixa").select("valor").eq("origem", "venda_iphone").eq("tipo", "entrada"),
    // ticket médio + quantidade: todos os iPhones já vendidos.
    supabase.from("iphones").select("valor_venda").eq("status", "vendido"),
    // série do gráfico: só as vendas dentro do período selecionado.
    (() => {
      const deEfetivo = de || dataISOHaMeses(6);
      const ateEfetivo = ate || hojeISO();
      return supabase
        .from("lancamentos_caixa")
        .select("data, valor")
        .eq("origem", "venda_iphone")
        .eq("tipo", "entrada")
        .gte("data", deEfetivo)
        .lte("data", ateEfetivo)
        .order("data");
    })(),
  ]);

  const lucroTotal = (vendasEntradas ?? []).reduce((soma, l) => soma + Number(l.valor), 0);
  const quantidadeVendida = vendidos?.length ?? 0;
  const ticketMedio =
    quantidadeVendida > 0
      ? (vendidos ?? []).reduce((soma, i) => soma + Number(i.valor_venda ?? 0), 0) / quantidadeVendida
      : 0;

  const deAtivo = de || "";
  const ateAtivo = ate || "";

  return (
    <div style={{ "--tint": "var(--nb-lucro)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Lucro Geral
        </h1>
        <p className="mt-1 text-[14px] text-[var(--nb-ink-secondary)]">
          Lucro acumulado{" "}
          <span className="font-bold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums]">
            {formatBRL(lucroTotal)}
          </span>{" "}
          · ticket médio{" "}
          <span className="font-bold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums]">
            {formatBRL(ticketMedio)}
          </span>{" "}
          · <span className="font-bold text-[var(--nb-ink)]">{quantidadeVendida}</span> vendidos
        </p>
      </header>

      <main className="px-4 pb-6">
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Evolução do lucro
          </h2>

          <form method="get" className="mt-3 flex flex-wrap items-end gap-2">
            <Pill href="/lucro" active={!de && !ate}>
              6 meses
            </Pill>
            <Pill href={`/lucro?de=${dataISOHaMeses(12)}`} active={de === dataISOHaMeses(12) && !ate}>
              12 meses
            </Pill>

            <label htmlFor="de" className="block">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
                De
              </span>
              <input
                id="de"
                name="de"
                type="date"
                defaultValue={deAtivo}
                className="mt-1 rounded-xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-2.5 py-1.5 text-[13px] text-[var(--nb-ink)] focus:outline-none"
              />
            </label>
            <label htmlFor="ate" className="block">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
                Até
              </span>
              <input
                id="ate"
                name="ate"
                type="date"
                defaultValue={ateAtivo}
                className="mt-1 rounded-xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-2.5 py-1.5 text-[13px] text-[var(--nb-ink)] focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full px-3.5 py-1.5 text-[13px] font-bold text-[var(--nb-accent-ink)] active:opacity-70"
              style={{ backgroundColor: "var(--tint)" }}
            >
              Aplicar
            </button>
          </form>

          <LucroChart lancamentos={entradasPeriodo ?? []} />
        </section>
      </main>
    </div>
  );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border px-3.5 py-1.5 text-[13px] font-bold"
      style={
        active
          ? {
              borderColor: "var(--tint)",
              color: "var(--tint)",
              backgroundColor: "color-mix(in srgb, var(--tint) 14%, transparent)",
            }
          : { borderColor: "var(--nb-separator)", color: "var(--nb-ink-secondary)", backgroundColor: "var(--nb-surface)" }
      }
    >
      {children}
    </Link>
  );
}
