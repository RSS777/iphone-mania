"use client";

import { toggleRecorrente } from "../actions";
import type { SaidaRecorrente } from "@/lib/caixa";
import { InlineTag } from "@/components/inline-tag";
import { formatBRL } from "@/lib/caixa";

export function RecorrenteRow({ recorrente }: { recorrente: SaidaRecorrente }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-paper-line py-3">
      <div className="min-w-0">
        <p className="truncate text-base text-ink">{recorrente.descricao}</p>
        <p className="font-ticket text-xs text-ink-faint">
          {formatBRL(Number(recorrente.valor))} · dia {recorrente.dia_vencimento} ·{" "}
          {recorrente.categorias_saida?.nome ?? "—"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {!recorrente.ativo ? <InlineTag>Inativa</InlineTag> : null}
        <form action={toggleRecorrente.bind(null, recorrente.id, recorrente.ativo)}>
          <button
            type="submit"
            className="font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            {recorrente.ativo ? "Desativar" : "Ativar"}
          </button>
        </form>
      </div>
    </div>
  );
}
