"use client";

import { useActionState, type SelectHTMLAttributes } from "react";
import { createRecorrente, type RecorrenteFormState } from "../actions";
import type { CategoriaSaida } from "@/lib/caixa";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: RecorrenteFormState = { error: null };

type NBSelectRowProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

/** Select nativo com o mesmo tratamento visual de um NBTextRow: cartão com contorno fino, rótulo pequeno em caixa alta. */
function NBSelectRow({ label, id, className = "", children, ...rest }: NBSelectRowProps) {
  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <label htmlFor={id} className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
        {label}
      </label>
      <select
        id={id}
        className={`mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

export function RecorrenteForm({ categorias }: { categorias: CategoriaSaida[] }) {
  const [state, formAction] = useActionState(createRecorrente, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBTextRow id="descricao" name="descricao" label="Descrição" required />
      <NBTextRow id="valor" name="valor" type="number" step="0.01" min="0" label="Valor (R$)" required />

      <NBSelectRow id="categoria_id" name="categoria_id" label="Categoria" defaultValue="">
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
      </NBSelectRow>

      <NBTextRow
        id="dia_vencimento"
        name="dia_vencimento"
        type="number"
        min="1"
        max="28"
        label="Dia de vencimento (1–28)"
        required
      />

      <p className="px-1 text-[13px] text-[var(--nb-ink-tertiary)]">Frequência: mensal.</p>

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel="Salvando…" className="mt-1">
        Cadastrar
      </NBButton>
    </form>
  );
}
