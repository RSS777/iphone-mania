"use client";

import { useFormStatus } from "react-dom";

type GhostSubmitProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
};

/** Ação secundária de formulário — link sublinhado, nunca o carimbo (reservado pro submit principal). */
export function GhostSubmit({ idleLabel, pendingLabel, className = "", disabled = false }: GhostSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`self-start font-ticket text-sm font-bold uppercase tracking-[0.14em] text-stamp-dark underline decoration-2 underline-offset-4 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
