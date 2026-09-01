"use client";

import { useActionState } from "react";
import { salvarMeta, type MetaFormState } from "./actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBMoneyRow } from "@/components/nb/money-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: MetaFormState = { error: null };

export function MetaForm({ mesInput, valorAtual }: { mesInput: string; valorAtual?: number }) {
  const [state, formAction] = useActionState(salvarMeta, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="mes" name="mes" type="month" label="Mês de referência" defaultValue={mesInput} required />
      <NBMoneyRow id="meta_valor" name="meta_valor" label="Meta de lucro" defaultValue={valorAtual} />

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel="Salvando…" className="mt-1">
        Salvar meta
      </NBButton>
    </form>
  );
}
