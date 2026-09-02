export const ORIGENS_COMPRA = [
  "OLX",
  "Facebook Marketplace",
  "Instagram",
  "Indicação",
  "Loja física",
] as const;

export const CAPACIDADES_GB = [64, 128, 256, 512, 1024] as const;

export const CHECKLIST_ITENS = [
  {
    key: "imei_verificado",
    label: "IMEI verificado",
    como: 'No iPhone: Ajustes > Geral > Sobre, role até "IMEI" e anote o número (ou disque *#06# no teclado). Depois abra o app Celular Seguro (Gov.br), faça login com Gov.br, cadastre/consulte o aparelho pelo IMEI e confira se consta como roubado, furtado ou bloqueado.',
  },
  {
    key: "bateria_80",
    label: "Bateria ≥ 80%",
    como: 'Ajustes > Bateria > Saúde e Carregamento da Bateria. Veja "Capacidade Máxima" — deve estar 80% ou mais. Também confira se aparece algum aviso de "Serviço de Bateria Recomendado".',
  },
  {
    key: "tela_sem_riscos",
    label: "Tela sem riscos/queimadura",
    como: "Com a tela limpa, incline o aparelho sob luz para ver riscos/microrrisco. Para queimadura (burn-in): abra uma foto ou app com fundo branco/cinza sólido (ex: app Notas em tela cheia) e observe manchas ou sombras persistentes, especialmente perto da barra de status.",
  },
  {
    key: "cameras_ok",
    label: "Câmeras ok",
    como: "Abra o app Câmera: tire fotos com a câmera traseira (todas as lentes, se houver) e frontal, grave um vídeo curto, teste o foco automático (toque na tela) e o flash. Verifique se a imagem está nítida, sem manchas ou sombras no visor.",
  },
  {
    key: "face_touch_id_ok",
    label: "Face ID/Touch ID ok",
    como: "Ajustes > Face ID e Código (ou Touch ID e Código). Confirme que já existe um rosto/digital cadastrada e teste bloqueando e desbloqueando o aparelho para ver se reconhece rápido e sem falhas.",
  },
  {
    key: "conectividade_ok",
    label: "Conectividade ok",
    como: "Teste Wi-Fi (Ajustes > Wi-Fi, conecte a uma rede), Bluetooth (Ajustes > Bluetooth, pareie com um fone/dispositivo), sinal de celular (faça uma ligação ou veja as barras de sinal) e GPS (abra o app Mapas e veja se localiza sua posição rapidamente).",
  },
  {
    key: "sensores_botoes_ok",
    label: "Sensores/botões ok",
    como: "Teste os botões de volume, a chave de silencioso/mudo e o botão liga/desliga. Gire o aparelho para checar o giroscópio/acelerômetro (a tela deve girar). Para o sensor True Tone, vá em Ajustes > Tela e Brilho e veja se a opção True Tone está disponível e funcionando.",
  },
  {
    key: "sem_reparo_nao_autorizado",
    label: "Sem sinal de reparo não autorizado",
    como: 'Em Ajustes > Geral > Sobre, role até "Histórico de Peças e Serviço" para ver se aparece peça não original/reparo não autorizado.',
  },
  {
    key: "carcaca_nao_estufada",
    label: "Carcaça não estufada",
    como: "Coloque o aparelho numa superfície plana e reta para ver se ele balança (indício de bateria estufada).",
  },
  { key: "nota_fiscal_disponivel", label: "Nota fiscal disponível" },
  {
    key: "apple_id_removido",
    label: "Apple ID removido/Find My desativado",
    como: "Confirme em Ajustes que não há Apple ID logado e que Buscar (Find My) está desativado — o ideal é o aparelho estar resetado, na tela inicial de configuração.",
  },
] as const;

export const STATUS_SEQUENCIA = ["avaliando", "comprado", "preparacao", "a_venda", "vendido"] as const;

export const STATUS_LABEL: Record<(typeof STATUS_SEQUENCIA)[number], string> = {
  avaliando: "Avaliando",
  comprado: "Comprado",
  preparacao: "Em preparação",
  a_venda: "À venda",
  vendido: "Vendido",
};

/** Próximo status na sequência manual (Avaliando → Comprado → Preparação → À venda). "Vendido" não faz parte — só a venda (ticket #7) leva a esse status. */
export function proximoStatus(atual: string): (typeof STATUS_SEQUENCIA)[number] | null {
  const index = STATUS_SEQUENCIA.indexOf(atual as (typeof STATUS_SEQUENCIA)[number]);
  if (index === -1 || index >= 3) return null;
  return STATUS_SEQUENCIA[index + 1];
}

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
  valor_venda: number | null;
  data_venda: string | null;
  canal_venda: string | null;
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
