"use client";

import { useActionState } from "react";
import { addCusto, type CustoFormState } from "../actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: CustoFormState = { error: null };

export function CustoForm({ iphoneId }: { iphoneId: string }) {
  const action = addCusto.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="descricao" name="descricao" label="Descrição" required />
      <div className="grid grid-cols-2 gap-3">
        <NBTextRow
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          min="0"
          label="Valor (R$)"
          required
          className="[font-variant-numeric:tabular-nums]"
        />
        <NBTextRow
          id="data"
          name="data"
          type="date"
          label="Data"
          defaultValue={new Date().toISOString().slice(0, 10)}
          required
          className="[color-scheme:dark]"
        />
      </div>

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" variant="tinted" pendingLabel="Adicionando…">
        + Adicionar custo
      </NBButton>
    </form>
  );
}
