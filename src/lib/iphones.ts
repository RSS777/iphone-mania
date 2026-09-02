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
    key: "multitouch_ok",
    label: "Toque na tela (multitouch)",
    como: 'Abra o app Notas, toque em desenhar (rascunho) e passe o dedo por toda a tela, incluindo os cantos e as bordas, procurando algum ponto onde o traço "falha" ou não responde.',
  },
  {
    key: "sensor_proximidade_ok",
    label: "Sensor de proximidade",
    como: "Faça uma ligação (mesmo que caia) e encoste o rosto/orelha no aparelho perto do alto-falante de cima. A tela deve apagar sozinha e voltar ao afastar.",
  },
  {
    key: "sensor_luz_ok",
    label: "Sensor de luz (brilho automático)",
    como: "Vá em Ajustes > Tela e Brilho, ative o Brilho Automático, tampe a câmera frontal com o dedo e veja se a tela escurece; destampe e veja se clareia de novo.",
  },
  {
    key: "atualizacao_ativacao_ok",
    label: "Atualização e bloqueio de ativação",
    como: "Vá em Ajustes > Geral > Atualização de Software e veja se ele aceita a versão mais recente do iOS (sinal de que não está preso a operadora/versão antiga). Peça ao vendedor pra confirmar que sabe a senha do Apple ID, caso precise reativar o aparelho depois de um reset.",
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
 * Fragmento de frase (minúsculo, sem ponto final) pra cada item do
 * checklist que passou — pra encaixar naturalmente numa frase corrida, não
 * virar lista de bullet. Nunca o IMEI em si (só a confiança de já ter sido
 * verificado), nunca dado interno (origem da compra, valor pago, observações
 * do sócio).
 */
const FRASE_CHECKLIST: Partial<Record<string, string>> = {
  bateria_80: "a bateria está com mais de 80% de saúde",
  tela_sem_riscos: "a tela não tem risco nem queimadura",
  carcaca_nao_estufada: "a carcaça está em perfeito estado, sem estufamento",
  cameras_ok: "as câmeras tiram foto e vídeo perfeitos",
  audio_ok: "o microfone e o alto-falante estão ótimos",
  som_volume_alto_ok: "o som fica limpo mesmo no volume máximo",
  multitouch_ok: "a tela responde bem ao toque em qualquer ponto",
  face_touch_id_ok: "o Face ID/Touch ID reconhece rápido, sem falhar",
  vibracao_ok: "a vibração é firme",
  sensor_proximidade_ok: "o sensor de proximidade funciona certinho",
  sensor_luz_ok: "o brilho automático ajusta sozinho",
  sensores_botoes_ok: "todos os botões e sensores foram testados",
  conectividade_ok: "Wi-Fi, Bluetooth, sinal e GPS funcionam sem problema",
  porta_carga_ok: "a porta de carga pega o cabo direto, sem precisar ajeitar",
  imei_verificado: "o IMEI foi consultado e está limpo",
  sem_reparo_nao_autorizado: "não tem sinal de reparo não autorizado",
  apple_id_removido: "já sai pronto pra usar, sem Apple ID travando",
  atualizacao_ativacao_ok: "atualiza pro iOS mais recente sem travar em bloqueio de ativação",
  nota_fiscal_disponivel: "acompanha nota fiscal",
};

/** "a, b e c" — encadeamento natural em vez de lista de bullet. */
function juntarNatural(itens: string[]): string {
  if (itens.length === 0) return "";
  if (itens.length === 1) return itens[0];
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

export type AnuncioGerado = { titulo: string; descricao: string };

/**
 * Gera título e descrição pra postar no OLX/Facebook Marketplace, a partir
 * só dos dados já informados no cadastro e no checklist — nunca usa IMEI,
 * valor de compra, origem da compra ou observações internas (dado sensível
 * ou que não é assunto do comprador). Escrito como um vendedor escreveria,
 * não como uma lista de especificações.
 */
export function gerarAnuncio(
  iphone: Pick<Iphone, "modelo" | "capacidade_gb" | "cor" | "checklist">,
): AnuncioGerado {
  const modeloLimpo = iphone.modelo.trim();
  const modeloComPrefixo = /^iphone\b/i.test(modeloLimpo) ? modeloLimpo : `iPhone ${modeloLimpo}`;
  const cor = iphone.cor.trim();

  const itensOk = CHECKLIST_ITENS.filter((item) => Boolean(iphone.checklist?.[item.key]));
  const bateriaOk = itensOk.some((item) => item.key === "bateria_80");

  // Título: modelo + capacidade + cor primeiro (é o que todo mundo digita na
  // busca), o resto vira uma frase curta e natural, não palavras empilhadas.
  const qualificadores = ["seminovo"];
  if (bateriaOk) qualificadores.push("bateria acima de 80%");
  const titulo = `${modeloComPrefixo} ${iphone.capacidade_gb}GB ${cor} – ${qualificadores.join(", ")}`;

  const frases = itensOk
    .map((item) => FRASE_CHECKLIST[item.key])
    .filter((frase): frase is string => Boolean(frase));

  // Quebra em frases de até 3 fragmentos, com conectivos variados, pra soar
  // como alguém contando o que testou — não uma lista de especificações.
  const conectivos = ["Já testei e", "Também conferi que", "Além disso,"];
  const paragrafos: string[] = [];
  for (let i = 0; i < frases.length; i += 3) {
    const bloco = frases.slice(i, i + 3);
    const conectivo = conectivos[(i / 3) % conectivos.length];
    paragrafos.push(`${conectivo} ${juntarNatural(bloco)}.`);
  }

  const linhas = [
    `Vendo esse ${modeloComPrefixo} ${iphone.capacidade_gb}GB na cor ${cor}, seminovo e em ótimo estado.`,
  ];
  if (paragrafos.length > 0) {
    linhas.push("", ...paragrafos);
  }
  linhas.push(
    "",
    "Aparelho original, sem nenhum detalhe escondido além do que já está descrito aqui.",
    "Chama no chat que a gente combina e te mando mais fotos!",
  );

  return { titulo, descricao: linhas.join("\n") };
}
