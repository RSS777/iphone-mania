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
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1" role="group" aria-label="Granularidade">
          {OPCOES.map((op) => (
            <button
              key={op.valor}
              type="button"
              onClick={() => setGranularidade(op.valor)}
              aria-pressed={granularidade === op.valor}
              className={`border px-3 py-1.5 font-ticket text-xs font-bold uppercase tracking-[0.1em] ${
                granularidade === op.valor
                  ? "border-stamp-dark text-stamp-dark"
                  : "border-dashed border-paper-line text-ink-faint hover:text-ink-soft"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setTabela((v) => !v)}
          className="font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
        >
          {tabela ? "Ver gráfico" : "Ver tabela"}
        </button>
      </div>

      {pontos.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Nenhuma venda nesse período.</p>
      ) : tabela ? (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-dashed border-paper-line text-left">
              <th className="pb-2 font-ticket text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                Período
              </th>
              <th className="pb-2 text-right font-ticket text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
                Lucro
              </th>
            </tr>
          </thead>
          <tbody>
            {pontos.map((p) => (
              <tr key={p.chave} className="border-b border-dashed border-paper-line">
                <td className="py-2 text-ink">{p.label}</td>
                <td className="py-2 text-right font-ticket text-ink">{formatBRL(p.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-6">
          <div className="relative" style={{ height: alturaGrafico }}>
            <div
              className="absolute inset-x-0 border-t border-paper-line"
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
                      className={`absolute mx-1 rounded-t-sm outline-none ${
                        positivo ? "bg-stamp" : "bg-errata"
                      } ${hover === i ? "opacity-80" : ""}`}
                      style={{
                        left: 0,
                        right: 0,
                        height: Math.max(2, alturaBarra),
                        top: positivo ? centroY - alturaBarra : centroY,
                        borderRadius: positivo ? "3px 3px 0 0" : "0 0 3px 3px",
                      }}
                    />
                    {hover === i ? (
                      <div
                        className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap border border-ink bg-paper px-2 py-1 font-ticket text-xs text-ink shadow-[0_2px_6px_rgb(34_32_28_/_25%)]"
                        style={{
                          left: "50%",
                          top: positivo ? Math.max(0, centroY - alturaBarra - 28) : centroY + alturaBarra + 6,
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
                className="flex-1 truncate text-center font-ticket text-[10px] text-ink-faint"
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
