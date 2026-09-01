"use client";

import { useState } from "react";
import { deleteIphone } from "../actions";

/** Confirmação em 2 passos, sem modal — pede um segundo carimbo antes de excluir. */
export function DeleteIphoneButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-ticket text-sm font-bold uppercase tracking-[0.14em] text-ink-soft underline decoration-paper-line decoration-2 underline-offset-4 hover:text-errata"
      >
        Excluir item
      </button>
    );
  }

  return (
    <div className="border-2 border-dashed border-errata bg-errata-soft px-4 py-3">
      <p className="font-ticket text-sm text-errata">
        <span className="font-bold uppercase tracking-[0.14em]">Errata — </span>
        Excluir esse item apaga o cadastro por completo. Confirma?
      </p>
      <div className="mt-3 flex gap-4">
        <form action={deleteIphone.bind(null, id)}>
          <button
            type="submit"
            className="font-ticket text-sm font-bold uppercase tracking-[0.14em] text-errata underline decoration-2 underline-offset-4"
          >
            Confirmar exclusão
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="font-ticket text-sm text-ink-soft underline decoration-paper-line decoration-2 underline-offset-4"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
