"use client";

import { useState } from "react";
import { renameCategoria, toggleCategoria } from "../actions";
import type { CategoriaSaida } from "@/lib/caixa";
import { InlineTag } from "@/components/inline-tag";

export function CategoriaRow({ categoria }: { categoria: CategoriaSaida }) {
  const [editando, setEditando] = useState(false);

  if (editando) {
    return (
      <form
        action={async (formData) => {
          await renameCategoria(categoria.id, formData);
          setEditando(false);
        }}
        className="flex items-center gap-2 border-b border-dashed border-paper-line py-3"
      >
        <input
          name="nome"
          defaultValue={categoria.nome}
          autoFocus
          className="min-w-0 flex-1 border-0 border-b-2 border-stamp-dark bg-transparent px-0 py-1 text-base text-ink focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 font-ticket text-xs uppercase tracking-[0.1em] text-stamp-dark underline decoration-2 underline-offset-4"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="shrink-0 font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4"
        >
          Cancelar
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-paper-line py-3">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-base text-ink">{categoria.nome}</p>
        {!categoria.ativo ? <InlineTag>Inativa</InlineTag> : null}
      </div>
      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
        >
          Editar
        </button>
        <form action={toggleCategoria.bind(null, categoria.id, categoria.ativo)}>
          <button
            type="submit"
            className="font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            {categoria.ativo ? "Desativar" : "Ativar"}
          </button>
        </form>
      </div>
    </div>
  );
}
