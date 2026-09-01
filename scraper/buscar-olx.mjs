import * as cheerio from "cheerio";

// User-Agent precisa parecer um navegador de verdade — um UA minimalista tipo
// "Mozilla/5.0" sozinho leva 403 do OLX (testado e confirmado em produção).
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function buscarOlx(config) {
  const url = `https://www.olx.com.br/celulares/celulares-e-smartphones?q=${encodeURIComponent(config.termos_busca)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`OLX respondeu ${res.status} pra "${config.termos_busca}"`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const precoMin = config.preco_min ?? 0;
  const precoMax = config.preco_max ?? Infinity;
  const resultados = [];

  $(".olx-adcard").each((_, el) => {
    const linkEl = $(el).find('[data-testid="adcard-link"]').first();
    const titulo = linkEl.find(".olx-adcard__title").text().trim() || linkEl.attr("title")?.trim() || "";
    const link = linkEl.attr("href");

    const precoTexto = $(el).find(".olx-adcard__price").first().text();
    const preco = Number(precoTexto.replace(/\D/g, ""));

    const localizacao = $(el)
      .find(".olx-adcard__location")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const imagem = $(el).find(".olx-adcard__media img").first().attr("src") ?? null;

    if (!link) return;
    const externalId = link.split("-").pop()?.split("?")[0];
    if (!externalId || !preco) return;
    if (preco < precoMin || preco > precoMax) return;

    resultados.push({
      id: externalId,
      titulo,
      preco,
      link,
      imagem,
      descricao: "",
      localizacao: localizacao || config.localizacao || null,
    });
  });

  return resultados;
}
