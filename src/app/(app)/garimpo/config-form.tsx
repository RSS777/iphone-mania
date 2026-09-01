"use client";

import { useActionState } from "react";
import { createConfig, type ConfigFormState } from "./actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBMoneyRow } from "@/components/nb/money-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";
import { FONTES_SCRAPING, FONTE_LABEL } from "@/lib/garimpo";

const initialState: ConfigFormState = { error: null };

export function ConfigForm() {
  const [state, formAction] = useActionState(createConfig, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="nome" name="nome" label="Nome da busca" placeholder="ex: iPhone 13 barato" required />

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
        <label
          htmlFor="fonte"
          className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
        >
          Fonte
        </label>
        <select
          id="fonte"
          name="fonte"
          defaultValue="olx"
          className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [color-scheme:dark]"
        >
          {FONTES_SCRAPING.map((fonte) => (
            <option key={fonte} value={fonte}>
              {FONTE_LABEL[fonte]}
            </option>
          ))}
        </select>
      </div>

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

      <NBTextRow id="localizacao" name="localizacao" label="Localização (opcional)" placeholder="ex: São Paulo" />

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" variant="tinted" pendingLabel="Criando…">
        + Adicionar busca
      </NBButton>
    </form>
  );
}
