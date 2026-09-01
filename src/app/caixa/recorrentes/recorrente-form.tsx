"use client";

import { useActionState } from "react";
import { createRecorrente, type RecorrenteFormState } from "../actions";
import type { CategoriaSaida } from "@/lib/caixa";
import { TicketField } from "@/components/ticket-field";
import { TicketSelect } from "@/components/ticket-select";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialState: RecorrenteFormState = { error: null };

export function RecorrenteForm({ categorias }: { categorias: CategoriaSaida[] }) {
  const [state, formAction] = useActionState(createRecorrente, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <TicketField id="descricao" name="descricao" label="Descrição" required />
      <TicketField id="valor" name="valor" type="number" step="0.01" min="0" label="Valor (R$)" required />

      <TicketSelect id="categoria_id" name="categoria_id" label="Categoria" defaultValue="">
        <option value="" disabled>
          Escolha
        </option>
        {categorias
          .filter((c) => c.ativo)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
      </TicketSelect>

      <TicketField
        id="dia_vencimento"
        name="dia_vencimento"
        type="number"
        min="1"
        max="28"
        label="Dia de vencimento (1–28)"
        required
      />

      <p className="font-ticket text-xs text-ink-faint">Frequência: mensal.</p>

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <StampButton idleLabel="Cadastrar" pendingLabel="Carimbando…" />
    </form>
  );
}
