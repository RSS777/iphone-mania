"use client";

import { useActionState } from "react";
import { createCategoria, type CategoriaFormState } from "../actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: CategoriaFormState = { error: null };

export function NovaCategoriaForm() {
  const [state, formAction] = useActionState(createCategoria, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="nome" name="nome" label="Nova categoria" required />
      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}
      <NBButton type="submit" variant="tinted" pendingLabel="Adicionando…">
        + Adicionar categoria
      </NBButton>
    </form>
  );
}
