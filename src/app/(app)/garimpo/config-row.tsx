"use client";

import { useState } from "react";
import { updateConfig, toggleConfigAtivo, deleteConfig } from "./actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBMoneyRow } from "@/components/nb/money-row";
import { type ScrapingConfig } from "@/lib/garimpo";

export function ConfigRow({ config }: { config: ScrapingConfig }) {
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  if (editando) {
    return (
      <form
        action={async (formData) => {
          await updateConfig(config.id, formData);
          setEditando(false);
        }}
        className="flex flex-col gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4"
      >
        <NBTextRow id={`nome-${config.id}`} name="nome" label="Nome da busca" defaultValue={config.nome} required />
        <NBTextRow
          id={`termos-${config.id}`}
          name="termos_busca"
          label="Termos de busca"
          defaultValue={config.termos_busca}
          required
        />
        <NBTextRow id={`modelo-${config.id}`} name="modelo" label="Modelo" defaultValue={config.modelo ?? undefined} />
        <div className="grid grid-cols-2 gap-3">
          <NBMoneyRow id={`min-${config.id}`} name="preco_min" label="Preço mín." defaultValue={config.preco_min} />
          <NBMoneyRow id={`max-${config.id}`} name="preco_max" label="Preço máx." defaultValue={config.preco_max} />
        </div>
        <NBTextRow
          id={`loc-${config.id}`}
          name="localizacao"
          label="Localização"
          defaultValue={config.localizacao ?? undefined}
        />
        <div className="mt-1 flex items-center gap-4">
          <button type="submit" className="text-[13px] font-bold" style={{ color: "var(--tint)" }}>
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="text-[13px] font-semibold text-[var(--nb-ink-tertiary)]"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-bold text-[var(--nb-ink)]">{config.nome}</p>
            {!config.ativo ? (
              <span
                className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: "color-mix(in srgb, var(--nb-ink-tertiary) 18%, transparent)", color: "var(--nb-ink-secondary)" }}
              >
                Inativa
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[12.5px] text-[var(--nb-ink-tertiary)]">
            &ldquo;{config.termos_busca}&rdquo;
            {config.preco_min || config.preco_max
              ? ` · R$ ${config.preco_min ?? 0} – ${config.preco_max ?? "∞"}`
              : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={() => setEditando(true)} className="text-[13px] font-semibold" style={{ color: "var(--tint)" }}>
          Editar
        </button>
        <form action={() => toggleConfigAtivo(config.id, config.ativo)}>
          <button
            type="submit"
            className="text-[13px] font-semibold"
            style={{ color: config.ativo ? "var(--nb-danger)" : "var(--tint)" }}
          >
            {config.ativo ? "Desativar" : "Ativar"}
          </button>
        </form>

        {confirmandoExclusao ? (
          <>
            <form action={() => deleteConfig(config.id)}>
              <button type="submit" className="text-[13px] font-bold text-[var(--nb-danger)]">
                Confirmar exclusão
              </button>
            </form>
            <button
              type="button"
              onClick={() => setConfirmandoExclusao(false)}
              className="text-[13px] font-semibold text-[var(--nb-ink-tertiary)]"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoExclusao(true)}
            className="text-[13px] font-semibold text-[var(--nb-ink-tertiary)]"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
