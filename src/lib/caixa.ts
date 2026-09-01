export type CategoriaSaida = {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
};

export type LancamentoCaixa = {
  id: string;
  tipo: "entrada" | "saida";
  categoria_id: string | null;
  descricao: string;
  valor: number;
  data: string;
  origem: "manual" | "venda_iphone" | "recorrencia";
  iphone_id: string | null;
  socio_id: string | null;
  created_at: string;
  categorias_saida?: { nome: string } | null;
  profiles?: { nome: string | null; email: string } | null;
};

export type SaidaRecorrente = {
  id: string;
  descricao: string;
  valor: number;
  categoria_id: string;
  frequencia: "mensal";
  dia_vencimento: number;
  ativo: boolean;
  created_at: string;
  categorias_saida?: { nome: string } | null;
};

export function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDataBR(data: string) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}
