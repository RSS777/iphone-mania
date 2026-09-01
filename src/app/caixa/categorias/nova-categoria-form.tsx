"use client";

import { useActionState } from "react";
import { createCategoria, type CategoriaFormState } from "../actions";
import { TicketField } from "@/components/ticket-field";
import { ErrataNote } from "@/components/errata-note";
import { GhostSubmit } from "@/components/ghost-submit";

const initialState: CategoriaFormState = { error: null };

export function NovaCategoriaForm() {
  const [state, formAction] = useActionState(createCategoria, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <TicketField id="nome" name="nome" label="Nova categoria" required />
      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}
      <GhostSubmit idleLabel="+ Adicionar categoria" pendingLabel="Adicionando…" />
    </form>
  );
}
