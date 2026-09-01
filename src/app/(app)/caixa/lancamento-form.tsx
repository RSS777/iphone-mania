"use client";

import { useActionState, useEffect, useState, type SelectHTMLAttributes } from "react";
import type { LancamentoFormState } from "./actions";
import type { CategoriaSaida, LancamentoCaixa } from "@/lib/caixa";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: LancamentoFormState = { error: null };

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
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <NBSelectRow
        key={tipo}
        id="tipo"
        name="tipo"
        label="Tipo"
        defaultValue={tipo}
        onChange={(e) => setTipo(e.target.value as "entrada" | "saida")}
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </NBSelectRow>

      <NBTextRow
        id="descricao"
        name="descricao"
        label="Descrição"
        defaultValue={defaultValues?.descricao}
        required
      />

      <NBTextRow
        id="valor"
        name="valor"
        type="number"
        step="0.01"
        min="0"
        label="Valor (R$)"
        defaultValue={defaultValues?.valor}
        required
      />

      <NBTextRow
        id="data"
        name="data"
        type="date"
        label="Data"
        defaultValue={defaultValues?.data ?? new Date().toISOString().slice(0, 10)}
        required
      />

      {tipo === "saida" ? (
        <NBSelectRow
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
        </NBSelectRow>
      ) : null}

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel="Salvando…" className="mt-1">
        {submitLabel}
      </NBButton>
    </form>
  );
}
