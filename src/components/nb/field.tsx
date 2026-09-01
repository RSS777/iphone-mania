import { type InputHTMLAttributes } from "react";

type NBFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Linha de formulário estilo neobank: label à esquerda, valor à direita, dentro de um cartão agrupado. */
export function NBField({ label, id, className = "", ...rest }: NBFieldProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <label htmlFor={id} className="w-[110px] shrink-0 text-[15px] text-[var(--nb-ink-secondary)]">
        {label}
      </label>
      <input
        id={id}
        className={`min-w-0 flex-1 bg-transparent text-right text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  );
}
