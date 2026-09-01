"use client";

import { useState } from "react";

type DeleteLancamentoButtonProps = {
  action: () => Promise<void>;
};

/** Confirmação em 2 passos, sem modal — mesmo mecanismo do mundo antigo, com o visual neobank. */
export function DeleteLancamentoButton({ action }: DeleteLancamentoButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-[15px] font-bold"
        style={{ color: "var(--nb-danger)" }}
      >
        Excluir lançamento
      </button>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border px-3.5 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--nb-danger) 12%, transparent)",
        borderColor: "color-mix(in srgb, var(--nb-danger) 30%, transparent)",
      }}
    >
      <p className="text-[14px]" style={{ color: "var(--nb-danger)" }}>
        Excluir esse lançamento apaga ele por completo do caixa. Confirma?
      </p>
      <div className="mt-3 flex gap-4">
        <form action={action}>
          <button type="submit" className="text-[14px] font-bold" style={{ color: "var(--nb-danger)" }}>
            Confirmar exclusão
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-[14px] text-[var(--nb-ink-secondary)]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
