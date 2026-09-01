export type Granularidade = "semana" | "mes" | "ano";

export type PontoLucro = { chave: string; label: string; valor: number };

const MESES_ABREV = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function inicioDaSemana(data: Date): Date {
  const d = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()));
  const diaSemana = d.getUTCDay(); // 0 = domingo
  const offset = diaSemana === 0 ? -6 : 1 - diaSemana; // segunda-feira como início
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

function chaveGranularidade(dataISO: string, granularidade: Granularidade): { chave: string; label: string } {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));

  if (granularidade === "ano") {
    return { chave: String(ano), label: String(ano) };
  }

  if (granularidade === "mes") {
    const chave = `${ano}-${String(mes).padStart(2, "0")}`;
    return { chave, label: `${MESES_ABREV[mes - 1]}/${String(ano).slice(2)}` };
  }

  const seg = inicioDaSemana(data);
  const chave = seg.toISOString().slice(0, 10);
  const label = `${String(seg.getUTCDate()).padStart(2, "0")}/${String(seg.getUTCMonth() + 1).padStart(2, "0")}`;
  return { chave, label };
}

/** Agrega lançamentos (já filtrados por período) somando valor por bucket de tempo, ordenado cronologicamente. */
export function agregarPorPeriodo(
  lancamentos: { data: string; valor: number }[],
  granularidade: Granularidade,
): PontoLucro[] {
  const buckets = new Map<string, PontoLucro>();

  for (const l of lancamentos) {
    const { chave, label } = chaveGranularidade(l.data, granularidade);
    const atual = buckets.get(chave);
    if (atual) {
      atual.valor += Number(l.valor);
    } else {
      buckets.set(chave, { chave, label, valor: Number(l.valor) });
    }
  }

  return Array.from(buckets.values()).sort((a, b) => (a.chave < b.chave ? -1 : 1));
}

export function dataISOHaMeses(meses: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - meses);
  return d.toISOString().slice(0, 10);
}

export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}
