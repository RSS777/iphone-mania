"use client";

import { useMemo, useState } from "react";
import { agregarPorPeriodo, type Granularidade } from "@/lib/lucro";
import { formatBRL } from "@/lib/caixa";

type LucroChartProps = {
  lancamentos: { data: string; valor: number }[];
};

const OPCOES: { valor: Granularidade; label: string }[] = [
  { valor: "semana", label: "Semana" },
  { valor: "mes", label: "Mês" },
  { valor: "ano", label: "Ano" },
];

export function LucroChart({ lancamentos }: LucroChartProps) {
  const [granularidade, setGranularidade] = useState<Granularidade>("mes");
  const [tabela, setTabela] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const pontos = useMemo(() => agregarPorPeriodo(lancamentos, granularidade), [lancamentos, granularidade]);

  const maxAbs = Math.max(1, ...pontos.map((p) => Math.abs(p.valor)));
  const larguraBarra = pontos.length > 0 ? 100 / pontos.length : 100;
  const alturaGrafico = 160;
  const centroY = alturaGrafico / 2;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5" role="group" aria-label="Granularidade">
          {OPCOES.map((op) => (
            <button
              key={op.valor}
              type="button"
              onClick={() => setGranularidade(op.valor)}
              aria-pressed={granularidade === op.valor}
              className="rounded-full border px-3 py-1.5 text-[12.5px] font-bold"
              style={
                granularidade === op.valor
                  ? {
                      borderColor: "var(--tint)",
                      color: "var(--tint)",
                      backgroundColor: "color-mix(in srgb, var(--tint) 14%, transparent)",
                    }
                  : {
                      borderColor: "var(--nb-separator)",
                      color: "var(--nb-ink-secondary)",
                      backgroundColor: "var(--nb-surface)",
                    }
              }
            >
              {op.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setTabela((v) => !v)}
          className="text-[12.5px] font-semibold text-[var(--nb-ink-secondary)]"
        >
          {tabela ? "Ver gráfico" : "Ver tabela"}
        </button>
      </div>

      {pontos.length === 0 ? (
        <p className="mt-6 text-[15px] text-[var(--nb-ink-secondary)]">Nenhuma venda nesse período.</p>
      ) : tabela ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)]">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-[var(--nb-separator)] text-left">
                <th className="px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
                  Período
                </th>
                <th className="px-4 py-2.5 text-right text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
                  Lucro
                </th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p) => (
                <tr key={p.chave} className="border-b border-[var(--nb-separator)] last:border-0">
                  <td className="px-4 py-2.5 text-[var(--nb-ink)]">{p.label}</td>
                  <td
                    className="px-4 py-2.5 text-right font-semibold [font-variant-numeric:tabular-nums]"
                    style={{ color: p.valor >= 0 ? "var(--tint)" : "var(--nb-danger)" }}
                  >
                    {formatBRL(p.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <div className="relative" style={{ height: alturaGrafico }}>
            <div
              className="absolute inset-x-0 border-t border-[var(--nb-ink-tertiary)] opacity-25"
              style={{ top: centroY }}
              aria-hidden="true"
            />
            <div className="flex h-full items-stretch">
              {pontos.map((p, i) => {
                const alturaBarra = (Math.abs(p.valor) / maxAbs) * (centroY - 8);
                const positivo = p.valor >= 0;
                return (
                  <div
                    key={p.chave}
                    className="relative flex-1"
                    style={{ width: `${larguraBarra}%` }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover((h) => (h === i ? null : h))}
                  >
                    <div
                      tabIndex={0}
                      role="img"
                      aria-label={`${p.label}: ${formatBRL(p.valor)}`}
                      className="absolute mx-1 outline-none transition-opacity"
                      style={{
                        left: 0,
                        right: 0,
                        height: Math.max(2, alturaBarra),
                        top: positivo ? centroY - alturaBarra : centroY,
                        borderRadius: positivo ? "3px 3px 0 0" : "0 0 3px 3px",
                        backgroundColor: positivo ? "var(--tint)" : "var(--nb-danger)",
                        opacity: hover === i ? 0.8 : 1,
                      }}
                    />
                    {hover === i ? (
                      <div
                        className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--nb-separator)] bg-[var(--nb-surface-2)] px-2 py-1 text-[12px] font-semibold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums] shadow-lg"
                        style={{
                          left: "50%",
                          top: positivo ? Math.max(0, centroY - alturaBarra - 30) : centroY + alturaBarra + 6,
                        }}
                      >
                        {formatBRL(p.valor)}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex">
            {pontos.map((p) => (
              <div
                key={p.chave}
                className="flex-1 truncate text-center text-[10.5px] text-[var(--nb-ink-tertiary)]"
                style={{ width: `${larguraBarra}%` }}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
