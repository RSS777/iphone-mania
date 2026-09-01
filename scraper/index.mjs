import { createClient } from "@supabase/supabase-js";
import { buscarOlx } from "./buscar-olx.mjs";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.error("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: configs, error } = await supabase.from("scraping_configs").select("*").eq("ativo", true);

if (error) {
  console.error("Erro ao buscar configs:", error);
  process.exit(1);
}

if (!configs || configs.length === 0) {
  console.log("Nenhuma config ativa — nada a fazer.");
  process.exit(0);
}

let totalErros = 0;

for (const config of configs) {
  if (config.fonte !== "olx") {
    console.log(`[${config.nome}] fonte "${config.fonte}" ainda não implementada — pulando.`);
    continue;
  }

  try {
    if (process.env.DEBUG_GARIMPO) {
      const url = `https://www.olx.com.br/celulares/celulares-e-smartphones?q=${encodeURIComponent(config.termos_busca)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9",
        },
      });
      console.log("DEBUG status:", res.status);
      console.log("DEBUG headers:", JSON.stringify([...res.headers.entries()]));
      const body = await res.text();
      console.log("DEBUG body (primeiros 500):", body.slice(0, 500));
    }

    const resultados = await buscarOlx(config);
    console.log(`[${config.nome}] ${resultados.length} anúncios encontrados`);

    for (const anuncio of resultados) {
      const { error: rpcError } = await supabase.rpc("processar_anuncio_scraping", {
        p_config_id: config.id,
        p_fonte: config.fonte,
        p_external_id: anuncio.id,
        p_titulo: anuncio.titulo,
        p_preco: anuncio.preco,
        p_link: anuncio.link,
        p_descricao: anuncio.descricao,
        p_imagem: anuncio.imagem,
        p_localizacao: anuncio.localizacao,
      });
      if (rpcError) {
        console.error(`[${config.nome}] erro ao processar anúncio ${anuncio.id}:`, rpcError.message);
        totalErros++;
      }
    }
  } catch (err) {
    console.error(`[${config.nome}] falhou:`, err.message);
    totalErros++;
  }
}

if (totalErros > 0) {
  console.error(`Finalizado com ${totalErros} erro(s).`);
  process.exit(1);
}

console.log("Finalizado sem erros.");
