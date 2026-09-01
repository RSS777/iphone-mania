export type MetaMensal = {
  id: string;
  mes_referencia: string;
  meta_valor: number;
  created_at: string;
  updated_at: string;
};

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** Primeiro dia do mês corrente, formato YYYY-MM-01. */
export function mesAtualISO(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
}

/** Normaliza um input tipo "2026-09" (do <input type=month>) pro formato YYYY-MM-01 salvo no banco. */
export function mesInputParaISO(mesInput: string): string {
  return `${mesInput}-01`;
}

export function isoParaMesInput(iso: string): string {
  return iso.slice(0, 7);
}

export function formatMesLabel(iso: string): string {
  const [ano, mes] = iso.split("-").map(Number);
  return `${MESES[mes - 1]}/${ano}`;
}

/** Primeiro e último dia (ISO) do mês de referência, pra filtrar lançamentos. */
export function limitesDoMes(iso: string): { inicio: string; fim: string } {
  const [ano, mes] = iso.split("-").map(Number);
  const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
  return { inicio, fim };
}
