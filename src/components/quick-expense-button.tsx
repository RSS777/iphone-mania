"use client";

import { useActionState, useEffect, useState } from "react";
import { createSaidaRapida, type SaidaRapidaState } from "@/app/caixa/actions";
import { TicketField } from "./ticket-field";
import { TicketSelect } from "./ticket-select";
import { StampButton } from "./stamp-button";
import { ErrataNote } from "./errata-note";

const initialState: SaidaRapidaState = { error: null, success: false };

type CategoriaResumo = { id: string; nome: string };

export function QuickExpenseButton({ categorias }: { categorias: CategoriaResumo[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createSaidaRapida, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 border-2 border-dashed border-paper-line bg-paper px-4 py-3 font-ticket text-xs font-bold uppercase tracking-[0.14em] text-ink-soft shadow-[0_1px_0_var(--paper-line),0_10px_20px_-14px_rgb(34_32_28_/_45%)] transition-colors hover:border-stamp-dark hover:text-stamp-dark"
      >
        + Saída
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="carbon-texture relative w-full max-w-sm bg-paper px-6 py-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-dashed border-paper-line pb-4">
              <h2 className="ink-title font-ticket text-xl font-bold text-ink">Saída rápida</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-errata"
              >
                Cancelar
              </button>
            </div>

            <form action={formAction} noValidate className="flex flex-col gap-4">
              <TicketField id="qe-valor" name="valor" type="number" step="0.01" min="0" label="Valor (R$)" />

              <TicketSelect id="qe-categoria" name="categoria_id" label="Categoria" defaultValue="">
                <option value="" disabled>
                  Escolha
                </option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </TicketSelect>

              <TicketField id="qe-descricao" name="descricao" label="Descrição (opcional)" />

              <TicketField
                id="qe-data"
                name="data"
                type="date"
                label="Data"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />

              {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

              <StampButton idleLabel="Lançar" pendingLabel="Carimbando…" />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
