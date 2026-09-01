"use client";

import { useActionState, useState } from "react";
import type { IphoneFormState } from "./actions";
import { ORIGENS_COMPRA, CAPACIDADES_GB, type Iphone } from "@/lib/iphones";
import { NBTextRow } from "@/components/nb/text-row";
import { NBMoneyRow } from "@/components/nb/money-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: IphoneFormState = { error: null };

type IphoneFormProps = {
  action: (prevState: IphoneFormState, formData: FormData) => Promise<IphoneFormState>;
  defaultValues?: Partial<Iphone>;
  submitLabel: string;
  pendingLabel: string;
};

export function IphoneForm({ action, defaultValues, submitLabel, pendingLabel }: IphoneFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  const origemConhecida =
    defaultValues && ORIGENS_COMPRA.includes(defaultValues.origem_compra as (typeof ORIGENS_COMPRA)[number]);
  const [origemOutro, setOrigemOutro] = useState(
    Boolean(defaultValues) && !origemConhecida,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="modelo" name="modelo" label="Modelo" defaultValue={defaultValues?.modelo} required />

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
        <label
          htmlFor="capacidade_gb"
          className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
        >
          Capacidade
        </label>
        <select
          id="capacidade_gb"
          name="capacidade_gb"
          defaultValue={defaultValues?.capacidade_gb ?? ""}
          required
          className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [color-scheme:dark]"
        >
          <option value="" disabled>
            Escolha
          </option>
          {CAPACIDADES_GB.map((gb) => (
            <option key={gb} value={gb}>
              {gb}GB
            </option>
          ))}
        </select>
      </div>

      <NBTextRow id="cor" name="cor" label="Cor" defaultValue={defaultValues?.cor} required />

      <NBTextRow
        id="imei"
        name="imei"
        label="IMEI"
        defaultValue={defaultValues?.imei}
        required
        className="[font-variant-numeric:tabular-nums]"
      />

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
        <label
          htmlFor="origem_compra"
          className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
        >
          Origem da compra
        </label>
        <select
          id="origem_compra"
          name="origem_compra"
          defaultValue={origemOutro ? "Outro" : defaultValues?.origem_compra}
          onChange={(e) => setOrigemOutro(e.target.value === "Outro")}
          required
          className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [color-scheme:dark]"
        >
          <option value="" disabled>
            Escolha
          </option>
          {ORIGENS_COMPRA.map((origem) => (
            <option key={origem} value={origem}>
              {origem}
            </option>
          ))}
          <option value="Outro">Outro</option>
        </select>
      </div>

      {origemOutro ? (
        <NBTextRow
          id="origem_compra_outro"
          name="origem_compra_outro"
          label="Qual?"
          defaultValue={!origemConhecida ? defaultValues?.origem_compra : undefined}
          required
        />
      ) : null}

      <NBMoneyRow
        id="valor_compra"
        name="valor_compra"
        label="Valor negociado"
        defaultValue={defaultValues?.valor_compra}
      />

      <NBTextRow
        id="data_compra"
        name="data_compra"
        type="date"
        label="Data da compra"
        defaultValue={defaultValues?.data_compra ?? undefined}
        className="[color-scheme:dark]"
      />

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
        <label
          htmlFor="observacoes"
          className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
        >
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          defaultValue={defaultValues?.observacoes ?? undefined}
          className="mt-1 w-full resize-y bg-transparent text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none"
        />
      </div>

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel={pendingLabel} className="mt-1">
        {submitLabel}
      </NBButton>
    </form>
  );
}
