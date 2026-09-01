"use client";

import { useActionState, useState } from "react";
import type { IphoneFormState } from "./actions";
import { ORIGENS_COMPRA, CAPACIDADES_GB, type Iphone } from "@/lib/iphones";
import { TicketField } from "@/components/ticket-field";
import { TicketSelect } from "@/components/ticket-select";
import { TicketNote } from "@/components/ticket-note";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialState: IphoneFormState = { error: null };

type IphoneFormProps = {
  action: (prevState: IphoneFormState, formData: FormData) => Promise<IphoneFormState>;
  defaultValues?: Iphone;
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
    <form action={formAction} className="flex flex-col gap-6">
      <TicketField id="modelo" name="modelo" label="Modelo" defaultValue={defaultValues?.modelo} required />

      <TicketSelect
        id="capacidade_gb"
        name="capacidade_gb"
        label="Capacidade"
        defaultValue={defaultValues?.capacidade_gb}
        required
      >
        <option value="" disabled>
          Escolha
        </option>
        {CAPACIDADES_GB.map((gb) => (
          <option key={gb} value={gb}>
            {gb}GB
          </option>
        ))}
      </TicketSelect>

      <TicketField id="cor" name="cor" label="Cor" defaultValue={defaultValues?.cor} required />

      <TicketField id="imei" name="imei" label="IMEI" defaultValue={defaultValues?.imei} required />

      <TicketSelect
        id="origem_compra"
        name="origem_compra"
        label="Origem da compra"
        defaultValue={origemOutro ? "Outro" : defaultValues?.origem_compra}
        onChange={(e) => setOrigemOutro(e.target.value === "Outro")}
        required
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
      </TicketSelect>

      {origemOutro ? (
        <TicketField
          id="origem_compra_outro"
          name="origem_compra_outro"
          label="Qual?"
          defaultValue={!origemConhecida ? defaultValues?.origem_compra : undefined}
          required
        />
      ) : null}

      <TicketField
        id="valor_compra"
        name="valor_compra"
        type="number"
        step="0.01"
        min="0"
        label="Valor negociado (R$)"
        defaultValue={defaultValues?.valor_compra ?? undefined}
      />

      <TicketField
        id="data_compra"
        name="data_compra"
        type="date"
        label="Data da compra"
        defaultValue={defaultValues?.data_compra ?? undefined}
      />

      <TicketNote
        id="observacoes"
        name="observacoes"
        label="Observações"
        defaultValue={defaultValues?.observacoes ?? undefined}
      />

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <StampButton idleLabel={submitLabel} pendingLabel={pendingLabel} />
    </form>
  );
}
