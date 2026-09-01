"use client";

import { useActionState } from "react";
import { salvarMeta, type MetaFormState } from "./actions";
import { TicketField } from "@/components/ticket-field";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialState: MetaFormState = { error: null };

export function MetaForm({ mesInput, valorAtual }: { mesInput: string; valorAtual?: number }) {
  const [state, formAction] = useActionState(salvarMeta, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <TicketField id="mes" name="mes" type="month" label="Mês de referência" defaultValue={mesInput} required />
      <TicketField
        id="meta_valor"
        name="meta_valor"
        type="number"
        step="0.01"
        min="0"
        label="Meta de lucro (R$)"
        defaultValue={valorAtual}
        required
      />

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <StampButton idleLabel="Salvar meta" pendingLabel="Carimbando…" />
    </form>
  );
}
