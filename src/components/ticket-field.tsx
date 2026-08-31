import { type InputHTMLAttributes } from "react";

type TicketFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Campo pautado, como uma linha de preenchimento numa ordem de serviço. */
export function TicketField({ label, id, className = "", ...rest }: TicketFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      <span className="relative mt-2 block">
        <input
          id={id}
          className={`w-full border-0 border-b-2 border-paper-line bg-transparent px-0 py-2 text-lg text-ink placeholder:text-ink-faint focus:border-stamp-dark focus:outline-none ${className}`}
          {...rest}
        />
        <span aria-hidden="true" className="ruled-line-echo" />
      </span>
    </label>
  );
}
