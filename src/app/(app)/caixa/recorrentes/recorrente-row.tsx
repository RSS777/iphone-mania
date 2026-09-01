"use client";

import { toggleRecorrente } from "../actions";
import type { SaidaRecorrente } from "@/lib/caixa";
import { formatBRL } from "@/lib/caixa";

export function RecorrenteRow({ recorrente }: { recorrente: SaidaRecorrente }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold text-[var(--nb-ink)]">{recorrente.descricao}</p>
        <p className="mt-0.5 truncate text-[12.5px] text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">
          {formatBRL(Number(recorrente.valor))} · dia {recorrente.dia_vencimento} ·{" "}
          {recorrente.categorias_saida?.nome ?? "—"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {!recorrente.ativo ? (
          <span
            className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--nb-ink-tertiary) 18%, transparent)",
              color: "var(--nb-ink-secondary)",
            }}
          >
            Inativa
          </span>
        ) : null}
        <form action={toggleRecorrente.bind(null, recorrente.id, recorrente.ativo)}>
          <button
            type="submit"
            className="text-[13px] font-semibold"
            style={{ color: recorrente.ativo ? "var(--nb-danger)" : "var(--nb-caixa)" }}
          >
            {recorrente.ativo ? "Desativar" : "Ativar"}
          </button>
        </form>
      </div>
    </div>
  );
}
