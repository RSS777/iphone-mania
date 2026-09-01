"use client";

import { useEffect, useState } from "react";

const ESTADOS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
] as const;

type Municipio = { id: number; nome: string };

type CityChipsProps = {
  name: string;
  defaultValue?: string[];
};

/**
 * Seleção de cidades em cascata Estado → Cidade (lista real de municípios via
 * API do IBGE), não texto livre — o valor salvo ("Cidade, UF") é usado como
 * filtro rígido no scraper: nenhum anúncio fora das cidades escolhidas entra
 * no banco, é regra.
 */
export function CityChips({ name, defaultValue = [] }: CityChipsProps) {
  const [cidades, setCidades] = useState<string[]>(defaultValue);
  const [uf, setUf] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      return;
    }
    let cancelado = false;
    setCarregando(true);
    setCidadeSelecionada("");
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then((r) => r.json())
      .then((data: Municipio[]) => {
        if (!cancelado) setMunicipios(data);
      })
      .catch(() => {
        if (!cancelado) setMunicipios([]);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [uf]);

  function adicionar() {
    if (!uf || !cidadeSelecionada) return;
    const valor = `${cidadeSelecionada}, ${uf}`;
    if (!cidades.includes(valor)) setCidades([...cidades, valor]);
    setCidadeSelecionada("");
  }

  function remover(cidade: string) {
    setCidades(cidades.filter((c) => c !== cidade));
  }

  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
      <label className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
        Cidades — regra: só garimpa nessas (vazio = qualquer lugar)
      </label>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <select
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="min-w-0 bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [color-scheme:dark]"
        >
          <option value="">Estado</option>
          {ESTADOS.map((e) => (
            <option key={e.sigla} value={e.sigla}>
              {e.nome}
            </option>
          ))}
        </select>
        <select
          value={cidadeSelecionada}
          onChange={(e) => setCidadeSelecionada(e.target.value)}
          disabled={!uf || carregando}
          className="min-w-0 bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none disabled:opacity-50 [color-scheme:dark]"
        >
          <option value="">{carregando ? "Carregando…" : "Cidade"}</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={adicionar}
        disabled={!uf || !cidadeSelecionada}
        className="mt-2 text-[13px] font-bold disabled:opacity-40"
        style={{ color: "var(--tint)" }}
      >
        + Adicionar cidade
      </button>

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
