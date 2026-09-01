"use client";

import { useState } from "react";

type CityChipsProps = {
  name: string;
  defaultValue?: string[];
};

/**
 * Seleção de cidades por chips — mais preciso que um campo de texto livre,
 * já que o scraper usa exatamente esses valores como filtro rígido (só
 * mostra anúncio cuja localização bate com uma das cidades escolhidas).
 */
export function CityChips({ name, defaultValue = [] }: CityChipsProps) {
  const [cidades, setCidades] = useState<string[]>(defaultValue);
  const [texto, setTexto] = useState("");

  function adicionar() {
    const valor = texto.trim();
    if (!valor) return;
    if (!cidades.some((c) => c.toLowerCase() === valor.toLowerCase())) {
      setCidades([...cidades, valor]);
    }
    setTexto("");
  }

  function remover(cidade: string) {
    setCidades(cidades.filter((c) => c !== cidade));
  }

  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
        Cidades (vazio = qualquer lugar)
      </label>
      <div className="mt-1 flex items-center gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
          }}
          placeholder="ex: Salvador"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none"
        />
        <button type="button" onClick={adicionar} className="shrink-0 text-[13px] font-bold" style={{ color: "var(--tint)" }}>
          Adicionar
        </button>
      </div>

      {cidades.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {cidades.map((cidade) => (
            <span
              key={cidade}
              className="inline-flex items-center gap-1.5 rounded-full py-1 pl-2.5 pr-1.5 text-[12.5px] font-semibold"
              style={{ backgroundColor: "color-mix(in srgb, var(--tint) 16%, transparent)", color: "var(--tint)" }}
            >
              {cidade}
              <button
                type="button"
                onClick={() => remover(cidade)}
                aria-label={`Remover ${cidade}`}
                className="flex h-4 w-4 items-center justify-center text-[13px] leading-none"
              >
                ×
              </button>
              <input type="hidden" name={name} value={cidade} />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
