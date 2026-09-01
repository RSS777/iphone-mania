import { type TextareaHTMLAttributes } from "react";

type TicketNoteProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

/** Área de observações — caixa de anotação de margem, não uma linha pautada. */
export function TicketNote({ label, id, className = "", ...rest }: TicketNoteProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      <textarea
        id={id}
        rows={3}
        className={`mt-2 w-full resize-y border border-dashed border-paper-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-stamp-dark focus:outline-none ${className}`}
        {...rest}
      />
    </label>
  );
}
