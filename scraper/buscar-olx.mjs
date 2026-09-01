import * as cheerio from "cheerio";

// ATENÇÃO: os seletores abaixo (`data-testid="ad-card"` / `"ad-price"`) precisam ser
// reconferidos contra o HTML real do OLX antes de considerar o scraper pronto — a
// plataforma muda o markup periodicamente. Inspecione via F12 → Elements num anúncio
// real e ajuste os seletores se o resultado vier vazio mesmo com anúncios visíveis.
export async function buscarOlx(config) {
  const url = `https://www.olx.com.br/celulares/celulares-e-smartphones?q=${encodeURIComponent(config.termos_busca)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });

  if (!res.ok) {
    throw new Error(`OLX respondeu ${res.status} pra "${config.termos_busca}"`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const precoMin = config.preco_min ?? 0;
  const precoMax = config.preco_max ?? Infinity;
  const resultados = [];

  $('[data-testid="ad-card"]').each((_, el) => {
    const titulo = $(el).find("h2").text().trim();
    const precoTexto = $(el).find('[data-testid="ad-price"]').text();
    const preco = Number(precoTexto.replace(/\D/g, ""));
    const linkRelativo = $(el).find("a").attr("href");
    const link = linkRelativo?.startsWith("http") ? linkRelativo : `https://www.olx.com.br${linkRelativo ?? ""}`;
    const externalId = linkRelativo?.split("-").pop()?.split("?")[0];
    const imagem = $(el).find("img").attr("src");

    if (!externalId || !preco) return;
    if (preco < precoMin || preco > precoMax) return;

    resultados.push({
      id: externalId,
      titulo,
      preco,
      link,
      imagem: imagem ?? null,
      descricao: "",
      localizacao: config.localizacao ?? null,
    });
  });

  return resultados;
}
