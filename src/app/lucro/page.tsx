import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Lucro Geral
            </h1>
            <p className="mt-2 text-sm text-ink">
              Lucro acumulado <span className="font-ticket font-bold">{formatBRL(lucroTotal)}</span> · ticket
              médio <span className="font-ticket font-bold">{formatBRL(ticketMedio)}</span> ·{" "}
              <span className="font-ticket font-bold">{quantidadeVendida}</span> vendidos
            </p>
          </header>

          <div className="mt-6">
            <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              Evolução do lucro
            </h2>

            <form method="get" className="mt-3 flex flex-wrap items-end gap-3">
              <Link
                href="/lucro"
                className={`border px-3 py-1.5 font-ticket text-xs font-bold uppercase tracking-[0.1em] ${
                  !de && !ate
                    ? "border-stamp-dark text-stamp-dark"
                    : "border-dashed border-paper-line text-ink-faint hover:text-ink-soft"
                }`}
              >
                6 meses
              </Link>
              <Link
                href={`/lucro?de=${dataISOHaMeses(12)}`}
                className={`border px-3 py-1.5 font-ticket text-xs font-bold uppercase tracking-[0.1em] ${
                  de === dataISOHaMeses(12) && !ate
                    ? "border-stamp-dark text-stamp-dark"
                    : "border-dashed border-paper-line text-ink-faint hover:text-ink-soft"
                }`}
              >
                12 meses
              </Link>

              <label htmlFor="de" className="block">
                <span className="font-ticket text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                  De
                </span>
                <input
                  id="de"
                  name="de"
                  type="date"
                  defaultValue={deAtivo}
                  className="mt-1 block border-0 border-b-2 border-paper-line bg-transparent px-0 py-1 text-sm text-ink focus:border-stamp-dark focus:outline-none"
                />
              </label>
              <label htmlFor="ate" className="block">
                <span className="font-ticket text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                  Até
                </span>
                <input
                  id="ate"
                  name="ate"
                  type="date"
                  defaultValue={ateAtivo}
                  className="mt-1 block border-0 border-b-2 border-paper-line bg-transparent px-0 py-1 text-sm text-ink focus:border-stamp-dark focus:outline-none"
                />
              </label>
              <button
                type="submit"
                className="font-ticket text-xs font-bold uppercase tracking-[0.1em] text-stamp-dark underline decoration-2 underline-offset-4"
              >
                Aplicar
              </button>
            </form>

            <LucroChart lancamentos={entradasPeriodo ?? []} />
          </div>
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="font-ticket text-[10px] uppercase tracking-[0.14em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            Voltar
          </Link>
        </p>
      </div>
    </main>
  );
}
