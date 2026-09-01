"use client";

import { useActionState } from "react";
import { registrarVenda, type VendaFormState } from "../actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: VendaFormState = { error: null };

export function VendaForm({ iphoneId }: { iphoneId: string }) {
  const action = registrarVenda.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow
        id="valor_venda"
        name="valor_venda"
        type="number"
        step="0.01"
        min="0"
        label="Valor de venda (R$)"
        className="[font-variant-numeric:tabular-nums]"
      />
      <NBTextRow
        id="data_venda"
        name="data_venda"
        type="date"
        label="Data da venda"
        defaultValue={new Date().toISOString().slice(0, 10)}
        className="[color-scheme:dark]"
      />
      <NBTextRow id="canal_venda" name="canal_venda" label="Comprador/canal (opcional)" />

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel="Registrando…">
        Registrar venda
      </NBButton>
    </form>
  );
}
