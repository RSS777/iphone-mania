"use client";

import { useActionState } from "react";
import { addCusto, type CustoFormState } from "../actions";
import { TicketField } from "@/components/ticket-field";
import { ErrataNote } from "@/components/errata-note";
import { GhostSubmit } from "@/components/ghost-submit";

const initialState: CustoFormState = { error: null };

export function CustoForm({ iphoneId }: { iphoneId: string }) {
  const action = addCusto.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <TicketField id="descricao" name="descricao" label="Descrição" className="col-span-2" required />
        <TicketField id="valor" name="valor" type="number" step="0.01" min="0" label="Valor (R$)" required />
        <TicketField
          id="data"
          name="data"
          type="date"
          label="Data"
          defaultValue={new Date().toISOString().slice(0, 10)}
          required
        />
      </div>

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <GhostSubmit idleLabel="+ Adicionar custo" pendingLabel="Adicionando…" />
    </form>
  );
}
