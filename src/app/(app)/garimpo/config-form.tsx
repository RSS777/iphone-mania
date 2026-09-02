"use client";

import { useActionState } from "react";
import { createConfig, type ConfigFormState } from "./actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBMoneyRow } from "@/components/nb/money-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";
import { CityChips } from "./city-chips";

const initialState: ConfigFormState = { error: null };

export function ConfigForm() {
  const [state, formAction] = useActionState(createConfig, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="nome" name="nome" label="Nome da busca" placeholder="ex: iPhone 13 barato" required />
      <p className="px-1 text-[12.5px] text-[var(--nb-ink-tertiary)]">Busca no OLX.</p>

      <NBTextRow
        id="termos_busca"
        name="termos_busca"
        label="Termos de busca"
        placeholder="ex: iphone 13 128gb"
        required
      />
      <NBTextRow id="modelo" name="modelo" label="Modelo (opcional)" placeholder="ex: iPhone 13" />

      <div className="grid grid-cols-2 gap-3">
        <NBMoneyRow id="preco_min" name="preco_min" label="Preço mín." />
        <NBMoneyRow id="preco_max" name="preco_max" label="Preço máx." />
      </div>

      <CityChips name="cidades" />

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" variant="tinted" pendingLabel="Criando…">
        + Adicionar busca
      </NBButton>
    </form>
  );
}
