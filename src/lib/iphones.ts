export const ORIGENS_COMPRA = [
  "OLX",
  "Facebook Marketplace",
  "Instagram",
  "Indicação",
  "Loja física",
] as const;

export const CAPACIDADES_GB = [64, 128, 256, 512, 1024] as const;

export const CHECKLIST_ITENS = [
  { key: "imei_verificado", label: "IMEI verificado" },
  { key: "bateria_80", label: "Bateria ≥ 80%" },
  { key: "tela_sem_riscos", label: "Tela sem riscos/queimadura" },
  { key: "cameras_ok", label: "Câmeras ok" },
  { key: "face_touch_id_ok", label: "Face ID/Touch ID ok" },
  { key: "conectividade_ok", label: "Conectividade ok" },
  { key: "sensores_botoes_ok", label: "Sensores/botões ok" },
  { key: "sem_reparo_nao_autorizado", label: "Sem sinal de reparo não autorizado" },
  { key: "carcaca_nao_estufada", label: "Carcaça não estufada" },
  { key: "nota_fiscal_disponivel", label: "Nota fiscal disponível" },
  { key: "apple_id_removido", label: "Apple ID removido/Find My desativado" },
] as const;

export type Iphone = {
  id: string;
  modelo: string;
  capacidade_gb: number;
  cor: string;
  imei: string;
  status: "avaliando" | "comprado" | "preparacao" | "a_venda" | "vendido";
  origem_compra: string;
  observacoes: string | null;
  valor_compra: number | null;
  data_compra: string | null;
  checklist: Record<string, boolean>;
  socio_responsavel_id: string;
  created_at: string;
  updated_at: string;
  profiles?: { nome: string | null; email: string } | null;
};

export type CustoAdicional = {
  id: string;
  iphone_id: string;
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
};

export type IphoneFoto = {
  id: string;
  iphone_id: string;
  path: string;
  ordem: number;
  created_at: string;
};

export function fotoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/iphone-fotos/${path}`;
}
