import { type InputHTMLAttributes } from "react";

type NBTextRowProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Campo de formulário estilo neobank: rótulo pequeno em caixa alta acima do valor, dentro de um cartão com contorno fino. */
export function NBTextRow({ label, id, className = "", ...rest }: NBTextRowProps) {
  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <label htmlFor={id} className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
        {label}
      </label>
      <input
        id={id}
        className={`mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  );
}
