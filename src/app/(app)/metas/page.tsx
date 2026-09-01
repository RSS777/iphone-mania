import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/caixa";
import { agregarPorPeriodo } from "@/lib/lucro";
import { mesAtualISO, isoParaMesInput, formatMesLabel, type MetaMensal } from "@/lib/metas";
import { MetasIcon } from "@/components/icons";
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
    <div style={{ "--tint": "var(--nb-metas)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Metas Mensais
        </h1>
        <p className="mt-1 text-[14px] text-[var(--nb-ink-secondary)]">{formatMesLabel(mesAtual)}</p>
      </header>

      <main className="px-4 pb-6">
        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          {metaAtual ? (
            <>
              <div className="flex items-baseline justify-between text-[15px]">
                <span className="font-bold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums]">
                  {formatBRL(lucroAtual)}
                </span>
                <span className="text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">
                  meta {formatBRL(Number(metaAtual.meta_valor))}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--nb-surface-2)]">
                <div
                  className="h-full rounded-full bg-[var(--tint)]"
                  style={{ width: `${Math.min(100, Math.max(0, pctAtual))}%` }}
                />
              </div>
              <p className="mt-2 text-[13px] text-[var(--nb-ink-tertiary)]">
                {pctAtual >= 100 ? `Meta batida — ${pctAtual.toFixed(0)}%` : `${pctAtual.toFixed(0)}% da meta`}
              </p>
            </>
          ) : (
            <p className="text-[15px] text-[var(--nb-ink-secondary)]">Meta não cadastrada pra esse mês ainda.</p>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Cadastrar / editar meta
          </h2>
          <div className="mt-3">
            <MetaForm mesInput={mesAtualInput} valorAtual={metaAtual ? Number(metaAtual.meta_valor) : undefined} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Histórico
          </h2>

          {!metas || metas.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <MetasIcon className="h-12 w-12 text-[var(--nb-ink-tertiary)]" />
              <p className="text-[15px] text-[var(--nb-ink-secondary)]">Nenhuma meta cadastrada ainda.</p>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {metas.map((m) => {
                const chave = isoParaMesInput(m.mes_referencia);
                const lucroMes = lucroPorMes.get(chave) ?? 0;
                const bateu = lucroMes >= Number(m.meta_valor);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold text-[var(--nb-ink)]">
                        {formatMesLabel(m.mes_referencia)}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">
                        {formatBRL(lucroMes)} de {formatBRL(Number(m.meta_valor))}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                      style={{
                        backgroundColor: bateu
                          ? "color-mix(in srgb, var(--tint) 14%, transparent)"
                          : "color-mix(in srgb, var(--nb-ink-tertiary) 14%, transparent)",
                        color: bateu ? "var(--tint)" : "var(--nb-ink-tertiary)",
                      }}
                    >
                      {bateu ? "Bateu" : "Não bateu"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
