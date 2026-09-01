import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { ProgressBar } from "@/components/progress-bar";
import { InlineTag } from "@/components/inline-tag";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/caixa";
import { agregarPorPeriodo } from "@/lib/lucro";
import { mesAtualISO, isoParaMesInput, formatMesLabel, type MetaMensal } from "@/lib/metas";
import { MetaForm } from "./meta-form";

export default async function MetasPage() {
  const supabase = await createClient();

  const [{ data: metas }, { data: vendas }] = await Promise.all([
    supabase.from("metas_mensais").select("*").order("mes_referencia", { ascending: false }).returns<MetaMensal[]>(),
    supabase.from("lancamentos_caixa").select("data, valor").eq("origem", "venda_iphone").eq("tipo", "entrada"),
  ]);

  const lucroPorMes = new Map(
    agregarPorPeriodo(vendas ?? [], "mes").map((p) => [p.chave, p.valor]),
  );

  const mesAtual = mesAtualISO();
  const mesAtualInput = isoParaMesInput(mesAtual);
  const metaAtual = (metas ?? []).find((m) => m.mes_referencia === mesAtual);
  const lucroAtual = lucroPorMes.get(mesAtualInput) ?? 0;
  const pctAtual = metaAtual ? (lucroAtual / Number(metaAtual.meta_valor)) * 100 : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Metas Mensais
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{formatMesLabel(mesAtual)}</p>
          </header>

          <section className="mt-6">
            {metaAtual ? (
              <>
                <div className="flex items-baseline justify-between font-ticket text-sm text-ink">
                  <span>{formatBRL(lucroAtual)}</span>
                  <span className="text-ink-faint">meta {formatBRL(Number(metaAtual.meta_valor))}</span>
                </div>
                <div className="mt-2">
                  <ProgressBar pct={pctAtual} />
                </div>
                <p className="mt-2 font-ticket text-xs text-ink-faint">
                  {pctAtual >= 100
                    ? `Meta batida — ${pctAtual.toFixed(0)}%`
                    : `${pctAtual.toFixed(0)}% da meta`}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Meta não cadastrada pra esse mês ainda.</p>
            )}
          </section>

          <section className="mt-8 border-t border-dashed border-paper-line pt-6">
            <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              Cadastrar / editar meta
            </h2>
            <div className="mt-4">
              <MetaForm mesInput={mesAtualInput} valorAtual={metaAtual ? Number(metaAtual.meta_valor) : undefined} />
            </div>
          </section>

          <section className="mt-8 border-t border-dashed border-paper-line pt-6">
            <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              Histórico
            </h2>

            {!metas || metas.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">Nenhuma meta cadastrada ainda.</p>
            ) : (
              <ul className="mt-4 flex flex-col">
                {metas.map((m) => {
                  const chave = isoParaMesInput(m.mes_referencia);
                  const lucroMes = lucroPorMes.get(chave) ?? 0;
                  const bateu = lucroMes >= Number(m.meta_valor);
                  return (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-3 border-b border-dashed border-paper-line py-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-ink">{formatMesLabel(m.mes_referencia)}</p>
                        <p className="font-ticket text-xs text-ink-faint">
                          {formatBRL(lucroMes)} de {formatBRL(Number(m.meta_valor))}
                        </p>
                      </div>
                      <InlineTag tone={bateu ? "stamp" : "ink"}>{bateu ? "Bateu" : "Não bateu"}</InlineTag>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
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
