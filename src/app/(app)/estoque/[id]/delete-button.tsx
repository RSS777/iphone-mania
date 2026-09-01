"use client";

import { useState } from "react";
import { deleteIphone } from "../actions";
import { NBButton } from "@/components/nb/button";

export function DeleteIphoneButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const action = deleteIphone.bind(null, id);

  if (!confirming) {
    return (
      <NBButton type="button" variant="destructive" onClick={() => setConfirming(true)}>
        Excluir item
      </NBButton>
    );
  }

  return (
    <div
      className="rounded-2xl border px-4 py-3.5"
      style={{
        backgroundColor: "color-mix(in srgb, var(--nb-danger) 12%, transparent)",
        borderColor: "color-mix(in srgb, var(--nb-danger) 30%, transparent)",
      }}
    >
      <p className="text-[14px]" style={{ color: "var(--nb-danger)" }}>
        Excluir esse item apaga o cadastro por completo. Confirma?
      </p>
      <div className="mt-3 flex gap-3">
        <form action={action} className="flex-1">
          <button
            type="submit"
            className="w-full rounded-2xl px-4 py-3.5 text-[15px] font-bold text-[var(--nb-accent-ink)] transition-opacity active:opacity-70"
            style={{ backgroundColor: "var(--nb-danger)" }}
          >
            Confirmar exclusão
          </button>
        </form>
        <NBButton type="button" variant="plain" onClick={() => setConfirming(false)} className="flex-1">
          Cancelar
        </NBButton>
      </div>
    </div>
  );
}
