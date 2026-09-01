export const ORIGENS_COMPRA = [
  "OLX",
  "Facebook Marketplace",
  "Instagram",
  "Indicação",
  "Loja física",
] as const;

export const CAPACIDADES_GB = [64, 128, 256, 512, 1024] as const;

export type Iphone = {
  id: string;
  modelo: string;
  capacidade_gb: number;
  cor: string;
  imei: string;
  status: "avaliando" | "comprado" | "preparacao" | "a_venda" | "vendido";
  origem_compra: string;
  observacoes: string | null;
  socio_responsavel_id: string;
  created_at: string;
  updated_at: string;
  profiles?: { nome: string | null; email: string } | null;
};
