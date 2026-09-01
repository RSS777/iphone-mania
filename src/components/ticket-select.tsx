import { type SelectHTMLAttributes } from "react";

type TicketSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
};

/** Select pautado, mesma linguagem do TicketField. */
export function TicketSelect({ label, id, className = "", children, ...rest }: TicketSelectProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      <span className="relative mt-2 block">
        <select
          id={id}
          className={`w-full appearance-none border-0 border-b-2 border-paper-line bg-transparent bg-[length:12px_8px] bg-[position:right_2px_center] bg-no-repeat px-0 py-2 pr-6 text-lg text-ink focus:border-stamp-dark focus:outline-none ${className}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2322201c' stroke-width='1.5'/%3E%3C/svg%3E\")",
          }}
          {...rest}
        >
          {children}
        </select>
        <span aria-hidden="true" className="ruled-line-echo" />
      </span>
    </label>
  );
}
