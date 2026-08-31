"use client";

import { useActionState } from "react";
import { updatePassword, type ResetPasswordState } from "./actions";
import { TicketField } from "@/components/ticket-field";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialState: ResetPasswordState = { error: null };

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, initialState);

  return (
    <form action={action} className="flex flex-col gap-6">
      <TicketField id="password" name="password" type="password" label="Nova senha" autoComplete="new-password" required />
      <TicketField
        id="confirmation"
        name="confirmation"
        type="password"
        label="Confirmar nova senha"
        autoComplete="new-password"
        required
      />

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <StampButton idleLabel="Trocar senha" pendingLabel="Carimbando…" />
    </form>
  );
}
