"use client";

import { useActionState, useEffect, useState } from "react";
import type { LancamentoFormState } from "./actions";
import type { CategoriaSaida, LancamentoCaixa } from "@/lib/caixa";
import { TicketField } from "@/components/ticket-field";
import { TicketSelect } from "@/components/ticket-select";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialState: LancamentoFormState = { error: null };

type LancamentoFormProps = {
  action: (prevState: LancamentoFormState, formData: FormData) => Promise<LancamentoFormState>;
  categorias: CategoriaSaida[];
  defaultValues?: LancamentoCaixa;
  submitLabel: string;
};

export function LancamentoForm({ action, categorias, defaultValues, submitLabel }: LancamentoFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const [tipo, setTipo] = useState(defaultValues?.tipo ?? "entrada");

  // depois de cada tentativa de submit (com erro), sincroniza com o tipo que
  // realmente foi enviado — a re-renderização do server action pode reiniciar
  // o <select> nativo sem disparar onChange.
  useEffect(() => {
    if (state.tipo) setTipo(state.tipo);
  }, [state]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <TicketSelect
        key={tipo}
        id="tipo"
        name="tipo"
        label="Tipo"
        defaultValue={tipo}
        onChange={(e) => setTipo(e.target.value as "entrada" | "saida")}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </TicketSelect>

      <TicketField
        id="descricao"
        name="descricao"
        label="Descrição"
        defaultValue={defaultValues?.descricao}
        required
      />

      <TicketField
        id="valor"
        name="valor"
        type="number"
        step="0.01"
        min="0"
        label="Valor (R$)"
        defaultValue={defaultValues?.valor}
        required
      />

      <TicketField
        id="data"
        name="data"
        type="date"
        label="Data"
        defaultValue={defaultValues?.data ?? new Date().toISOString().slice(0, 10)}
        required
      />

      {tipo === "saida" ? (
        <TicketSelect
          id="categoria_id"
          name="categoria_id"
          label="Categoria"
          defaultValue={defaultValues?.categoria_id ?? ""}
          required
        >
          <option value="" disabled>
            Escolha
          </option>
          {categorias
            .filter((c) => c.ativo || c.id === defaultValues?.categoria_id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
                {!c.ativo ? " (inativa)" : ""}
              </option>
            ))}
        </TicketSelect>
      ) : null}

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <StampButton idleLabel={submitLabel} pendingLabel="Carimbando…" />
    </form>
  );
}
