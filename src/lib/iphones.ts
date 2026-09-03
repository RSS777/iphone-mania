export const ORIGENS_COMPRA = [
  "OLX",
  "Facebook Marketplace",
  "Instagram",
  "Indicação",
  "Loja física",
] as const;

export const CAPACIDADES_GB = [64, 128, 256, 512, 1024] as const;

export const CHECKLIST_ITENS = [
  // 1. Visual — sem mexer em nada, só olhar o aparelho.
  {
    key: "carcaca_nao_estufada",
    label: "Carcaça não estufada",
    como: "Coloque o aparelho numa superfície plana e reta para ver se ele balança (indício de bateria estufada).",
  },
  {
    key: "tela_sem_riscos",
    label: "Tela sem riscos/queimadura",
    como: "Com a tela limpa, incline o aparelho sob luz para ver riscos/microrrisco. Para queimadura (burn-in): abra uma foto ou app com fundo branco/cinza sólido (ex: app Notas em tela cheia) e observe manchas ou sombras persistentes, especialmente perto da barra de status.",
  },
  // 2. Ajustes > Geral > Sobre — IMEI e histórico de peças/reparo, mesma tela.
  {
    key: "imei_verificado",
    label: "IMEI verificado",
    como: 'No iPhone: Ajustes > Geral > Sobre, role até "IMEI" e anote o número (ou disque *#06# no teclado). Depois abra o app Celular Seguro (Gov.br), faça login com Gov.br, cadastre/consulte o aparelho pelo IMEI e confira se consta como roubado, furtado ou bloqueado.',
  },
  {
    key: "sem_reparo_nao_autorizado",
    label: "Sem sinal de reparo não autorizado",
    como: 'Em Ajustes > Geral > Sobre, role até "Histórico de Peças e Serviço" para ver se aparece peça não original/reparo não autorizado.',
  },
  // 3. Ajustes > Geral > Atualização de Software.
  {
    key: "atualizacao_ativacao_ok",
    label: "Atualização e bloqueio de ativação",
    como: "Vá em Ajustes > Geral > Atualização de Software e veja se ele aceita a versão mais recente do iOS (sinal de que não está preso a operadora/versão antiga). Peça ao vendedor pra confirmar que sabe a senha do Apple ID, caso precise reativar o aparelho depois de um reset.",
  },
  // 4. Ajustes > Bateria + Tela e Brilho.
  {
    key: "bateria_80",
    label: "Bateria ≥ 80%",
    como: 'Ajustes > Bateria > Saúde e Carregamento da Bateria. Veja "Capacidade Máxima" — deve estar 80% ou mais. Também confira se aparece algum aviso de "Serviço de Bateria Recomendado".',
  },
  {
    key: "sensor_luz_ok",
    label: "Sensor de luz (brilho automático)",
    como: "Vá em Ajustes > Tela e Brilho, ative o Brilho Automático, tampe a câmera frontal com o dedo e veja se a tela escurece; destampe e veja se clareia de novo.",
  },
  // 5. Ajustes > Face ID e Código + Buscar.
  {
    key: "face_touch_id_ok",
    label: "Face ID/Touch ID ok",
    como: "Ajustes > Face ID e Código (ou Touch ID e Código). Confirme que já existe um rosto/digital cadastrada e teste bloqueando e desbloqueando o aparelho para ver se reconhece rápido e sem falhas.",
  },
  {
    key: "apple_id_removido",
    label: "Apple ID removido/Find My desativado",
    como: "Confirme em Ajustes que não há Apple ID logado e que Buscar (Find My) está desativado — o ideal é o aparelho estar resetado, na tela inicial de configuração.",
  },
  // 6. Ligação de teste — sinal + proximidade juntos, depois Wi-Fi/Bluetooth/GPS.
  {
    key: "sensor_proximidade_ok",
    label: "Sensor de proximidade",
    como: "Faça uma ligação (mesmo que caia) e encoste o rosto/orelha no aparelho perto do alto-falante de cima. A tela deve apagar sozinha e voltar ao afastar.",
  },
  {
    key: "conectividade_ok",
    label: "Conectividade ok",
    como: "Teste Wi-Fi (Ajustes > Wi-Fi, conecte a uma rede), Bluetooth (Ajustes > Bluetooth, pareie com um fone/dispositivo), sinal de celular (faça uma ligação ou veja as barras de sinal) e GPS (abra o app Mapas e veja se localiza sua posição rapidamente).",
  },
  // 7. Apps em sequência: Câmera → Notas (multitouch) → Gravador de Voz → Música.
  {
    key: "cameras_ok",
    label: "Câmeras ok",
    como: "Abra o app Câmera: tire fotos com a câmera traseira (todas as lentes, se houver) e frontal, grave um vídeo curto, teste o foco automático (toque na tela) e o flash. Verifique se a imagem está nítida, sem manchas ou sombras no visor.",
  },
  {
    key: "multitouch_ok",
    label: "Toque na tela (multitouch)",
    como: 'Abra o app Notas, toque em desenhar (rascunho) e passe o dedo por toda a tela, incluindo os cantos e as bordas, procurando algum ponto onde o traço "falha" ou não responde.',
  },
  {
    key: "audio_ok",
    label: "Áudio (microfone + alto-falante)",
    como: "Abra o app Gravador de Voz, grave um áudio de alguns segundos falando normal e dando um toque mais forte, depois dê o play no volume máximo. Se tiver chiado, corte ou som abafado, é sinal de problema no microfone ou no alto-falante.",
  },
  {
    key: "som_volume_alto_ok",
    label: "Som em volume alto",
    como: 'Abra o app Música (ou um vídeo qualquer) e toque algo no volume máximo. Preste atenção se range, distorce ou soa "rachado" — indício de membrana do alto-falante danificada.',
  },
  // 8. Físico: mudo+Timer, cabo, botões/giroscópio, nota fiscal por último.
  {
    key: "vibracao_ok",
    label: "Vibração",
    como: 'Ative o modo silencioso (chave lateral) e abra o app Relógio, inicie um Timer curto. Sinta se a vibração é firme e uniforme, não fraca nem "granulada".',
  },
  {
    key: "porta_carga_ok",
    label: "Porta de carga",
    como: 'Conecte o cabo de carregar (de preferência o do próprio vendedor) e veja se o ícone de bateria muda para "carregando" rápido e sem precisar ficar mexendo no cabo pra pegar contato.',
  },
  {
    key: "sensores_botoes_ok",
    label: "Sensores/botões ok",
    como: "Teste os botões de volume, a chave de silencioso/mudo e o botão liga/desliga. Gire o aparelho para checar o giroscópio/acelerômetro (a tela deve girar). Para o sensor True Tone, vá em Ajustes > Tela e Brilho e veja se a opção True Tone está disponível e funcionando.",
  },
  { key: "nota_fiscal_disponivel", label: "Nota fiscal disponível" },
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
  observacao_checklist: string | null;
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

/**
 * Atributo curto (minúsculo, sem verbo/sujeito) pra cada item do checklist
 * — pensado como característica do aparelho, não como "eu testei isso".
 * Só os itens que mais pesam na decisão de compra entram no resumo (ver
 * PRIORIDADE_ANUNCIO); os outros ficam só no checklist interno. Nunca o
 * IMEI em si (só a confiança de já ter sido verificado), nunca dado interno
 * (origem da compra, valor pago, observações do sócio).
 */
const ATRIBUTO_CHECKLIST: Partial<Record<string, string>> = {
  bateria_80: "bateria acima de 80% de saúde",
  tela_sem_riscos: "tela sem riscos nem queimadura",
  cameras_ok: "câmeras perfeitas",
  carcaca_nao_estufada: "carcaça sem estufamento",
  imei_verificado: "IMEI verificado e limpo",
  apple_id_removido: "pronto pra uso, sem Apple ID",
};

/** Ordem de prioridade pro resumo — só os que mais pesam na decisão de compra. */
const PRIORIDADE_ANUNCIO = [
  "bateria_80",
  "tela_sem_riscos",
  "cameras_ok",
  "imei_verificado",
  "apple_id_removido",
  "carcaca_nao_estufada",
] as const;

/** "a, b e c" — encadeamento natural em vez de lista de bullet. */
function juntarNatural(itens: string[]): string {
  if (itens.length === 0) return "";
  if (itens.length === 1) return itens[0];
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** Tira espaço/acento pra virar uma palavra só, pronta pra virar #hashtag. */
function paraHashtag(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "");
}

export type AnuncioGerado = { titulo: string; descricao: string };

/**
 * Gera título e descrição pra postar no OLX/Facebook Marketplace, a partir
 * só dos dados já informados no cadastro e no checklist — nunca usa IMEI,
 * valor de compra, origem da compra ou observações internas (dado sensível
 * ou que não é assunto do comprador). Resumo direto — características do
 * aparelho, sem primeira pessoa e sem listar tudo que foi checado.
 */
export function gerarAnuncio(
  iphone: Pick<Iphone, "modelo" | "capacidade_gb" | "cor" | "checklist">,
): AnuncioGerado {
  const modeloLimpo = iphone.modelo.trim();
  const modeloComPrefixo = /^iphone\b/i.test(modeloLimpo) ? modeloLimpo : `iPhone ${modeloLimpo}`;
  const cor = iphone.cor.trim();

  const checklist = iphone.checklist ?? {};
  const bateriaOk = Boolean(checklist.bateria_80);

  // Título: modelo + capacidade + cor primeiro (é o que todo mundo digita na
  // busca), o resto vira uma frase curta e natural, não palavras empilhadas.
  const qualificadores = ["seminovo"];
  if (bateriaOk) qualificadores.push("bateria acima de 80%");
  const titulo = `${modeloComPrefixo} ${iphone.capacidade_gb}GB ${cor} – ${qualificadores.join(", ")}`;

  const atributos = PRIORIDADE_ANUNCIO.filter((key) => Boolean(checklist[key])).map(
    (key) => ATRIBUTO_CHECKLIST[key]!,
  );

  const linhas = [`${modeloComPrefixo} ${iphone.capacidade_gb}GB, cor ${cor}, seminovo.`];
  if (atributos.length > 0) {
    const [primeiro, ...resto] = atributos;
    const frase = resto.length > 0 ? `${primeiro}, ${juntarNatural(resto)}` : primeiro;
    linhas.push(`${frase[0].toUpperCase()}${frase.slice(1)}.`);
  }
  linhas.push("", "Chama no chat!");

  const hashtags = [
    `#${paraHashtag(modeloComPrefixo)}`,
    `#iPhone${iphone.capacidade_gb}GB`,
    `#${paraHashtag(cor)}`,
    "#Seminovo",
    "#iPhoneUsado",
    "#Apple",
  ];
  if (bateriaOk) hashtags.push("#BateriaBoa");
  linhas.push("", hashtags.join(" "));

  return { titulo, descricao: linhas.join("\n") };
}
