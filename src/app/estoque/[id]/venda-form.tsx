"use client";

import { useActionState } from "react";
import { registrarVenda, type VendaFormState } from "../actions";
import { TicketField } from "@/components/ticket-field";
import { ErrataNote } from "@/components/errata-note";
import { GhostSubmit } from "@/components/ghost-submit";

const initialState: VendaFormState = { error: null };

export function VendaForm({ iphoneId }: { iphoneId: string }) {
  const action = registrarVenda.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <TicketField id="valor_venda" name="valor_venda" type="number" step="0.01" min="0" label="Valor de venda (R$)" />
      <TicketField
        id="data_venda"
        name="data_venda"
        type="date"
        label="Data da venda"
        defaultValue={new Date().toISOString().slice(0, 10)}
      />
      <TicketField id="canal_venda" name="canal_venda" label="Comprador/canal (opcional)" />

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <GhostSubmit idleLabel="Registrar venda" pendingLabel="Registrando…" />
    </form>
  );
}
