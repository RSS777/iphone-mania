"use client";

import { useState } from "react";
import { renameCategoria, toggleCategoria } from "../actions";
import type { CategoriaSaida } from "@/lib/caixa";

export function CategoriaRow({ categoria }: { categoria: CategoriaSaida }) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <form
        action={async (formData) => {
          await renameCategoria(categoria.id, formData);
          setEditando(false);
        }}
        className="flex items-center gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3"
      >
        <input
          name="nome"
          defaultValue={categoria.nome}
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none"
        />
        <button type="submit" className="shrink-0 text-[13px] font-bold" style={{ color: "var(--nb-caixa)" }}>
          Salvar
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="shrink-0 text-[13px] font-semibold text-[var(--nb-ink-tertiary)]"
        >
          Cancelar
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-[15px] font-bold text-[var(--nb-ink)]">{categoria.nome}</p>
        {!categoria.ativo ? (
          <span
            className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--nb-ink-tertiary) 18%, transparent)",
              color: "var(--nb-ink-secondary)",
            }}
          >
            Inativa
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="text-[13px] font-semibold"
          style={{ color: "var(--nb-caixa)" }}
        >
          Editar
        </button>
        <form action={toggleCategoria.bind(null, categoria.id, categoria.ativo)}>
          <button
            type="submit"
            className="text-[13px] font-semibold"
            style={{ color: categoria.ativo ? "var(--nb-danger)" : "var(--nb-caixa)" }}
          >
            {categoria.ativo ? "Desativar" : "Ativar"}
          </button>
        </form>
      </div>
    </div>
  );
}
