"use client";

import { useState } from "react";

function BotaoCopiar({ texto, label }: { texto: string; label: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard indisponível (ex: sem HTTPS) — o texto já está selecionável na tela
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="shrink-0 text-[12.5px] font-bold"
      style={{ color: copiado ? "var(--nb-estoque)" : "var(--tint)" }}
    >
      {copiado ? "Copiado!" : label}
    </button>
  );
}

export function AnuncioGeradoView({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-[var(--nb-ink-secondary)]">
        Gerado a partir do cadastro e do checklist — sem IMEI nem dados internos. Revise antes de postar.
      </p>

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface-2)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Título
          </span>
          <BotaoCopiar texto={titulo} label="Copiar título" />
        </div>
        <p className="mt-1 text-[14.5px] font-semibold text-[var(--nb-ink)]">{titulo}</p>
      </div>

      <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface-2)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Descrição
          </span>
          <BotaoCopiar texto={descricao} label="Copiar descrição" />
        </div>
        <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-[var(--nb-ink)]">{descricao}</p>
      </div>
    </div>
  );
}
