export const FONTES_SCRAPING = ["olx", "facebook"] as const;

export const FONTE_LABEL: Record<(typeof FONTES_SCRAPING)[number], string> = {
  olx: "OLX",
  facebook: "Facebook",
};

export type ScrapingConfig = {
  id: string;
  nome: string;
  fonte: (typeof FONTES_SCRAPING)[number];
  termos_busca: string;
  modelo: string | null;
  preco_min: number | null;
  preco_max: number | null;
  localizacao: string | null;
  ativo: boolean;
  created_at: string;
  ultimo_erro: string | null;
  ultimo_erro_em: string | null;
};

/** O texto exato levantado em scraper/buscar_facebook.py quando a sessão expira. */
export function sessaoFacebookExpirou(config: Pick<ScrapingConfig, "fonte" | "ultimo_erro">) {
  return config.fonte === "facebook" && Boolean(config.ultimo_erro?.toLowerCase().includes("sessão"));
}

export type ScrapingAnuncioStatus = "novo" | "visto" | "descartado" | "avaliado";

export type ScrapingAnuncio = {
  id: string;
  config_id: string | null;
  external_id: string;
  fonte: string;
  titulo: string | null;
  preco: number | null;
  preco_anterior: number | null;
  link: string;
  descricao: string | null;
  imagem_capa: string | null;
  localizacao: string | null;
  status: ScrapingAnuncioStatus;
  primeira_vez_em: string;
  atualizado_em: string;
};
