"use client";

import { useLayoutEffect, useRef, useState, type ChangeEvent } from "react";

type NBMoneyRowProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: number | null;
  className?: string;
};

function centavosParaExibicao(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Campo de valor em R$ estilo Pix: digita só números e a vírgula "corre" —
 * cada dígito entra pela direita, sempre com duas casas decimais fixas.
 */
export function NBMoneyRow({ id, name, label, defaultValue, className = "" }: NBMoneyRowProps) {
  const [centavos, setCentavos] = useState(() => Math.round((defaultValue ?? 0) * 100));
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digitos = e.target.value.replace(/\D/g, "");
    const semZerosEsquerda = digitos.replace(/^0+(?=\d)/, "");
    setCentavos(semZerosEsquerda === "" ? 0 : Number(semZerosEsquerda));
  }

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement === el) {
      const fim = el.value.length;
      el.setSelectionRange(fim, fim);
    }
  }, [centavos]);

  const valorDecimal = (centavos / 100).toFixed(2);

  return (
    <div className={`rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3 ${className}`}>
      <label htmlFor={id} className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
        {label}
      </label>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[15px] text-[var(--nb-ink-secondary)]">R$</span>
        <input
          ref={inputRef}
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={centavosParaExibicao(centavos)}
          onChange={handleChange}
          aria-label={label}
          className="w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [font-variant-numeric:tabular-nums]"
        />
      </div>
      <input type="hidden" name={name} value={centavos === 0 ? "" : valorDecimal} />
    </div>
  );
}
