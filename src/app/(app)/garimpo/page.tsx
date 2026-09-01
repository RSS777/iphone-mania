import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnunciosList } from "./anuncios-list";
import { sessaoFacebookExpirou, type ScrapingAnuncio, type ScrapingConfig } from "@/lib/garimpo";

export default async function GarimpoPage() {
  const supabase = await createClient();
  const [{ data: anuncios }, { data: configs }] = await Promise.all([
    supabase
      .from("scraping_anuncios")
      .select("*")
      .eq("status", "novo")
      .order("preco", { ascending: true })
      .returns<ScrapingAnuncio[]>(),
    supabase.from("scraping_configs").select("*").order("nome").returns<ScrapingConfig[]>(),
  ]);

  return (
    <div style={{ "--tint": "var(--nb-garimpo)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
            Garimpo
          </h1>
          <Link href="/garimpo/configurar" className="text-[14px] font-semibold" style={{ color: "var(--nb-garimpo)" }}>
            Configurar
          </Link>
        </div>
      </header>

      <main className="px-4 pb-6">
        {(configs ?? [])
          .filter((c) => c.ativo && c.ultimo_erro)
          .map((config) => (
            <div
              key={config.id}
              role="alert"
              className="mb-3 rounded-2xl border px-4 py-3 text-[13.5px] leading-snug"
              style={{
                backgroundColor: "color-mix(in srgb, var(--nb-danger) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--nb-danger) 30%, transparent)",
                color: "var(--nb-danger)",
              }}
            >
              {sessaoFacebookExpirou(config) ? (
                <>
                  <strong>{config.nome}</strong> parou — a sessão do Facebook expirou. Rode{" "}
                  <code className="[font-variant-numeric:tabular-nums]">
                    bash scraper/scripts/setup-facebook-cookies.sh
                  </code>{" "}
                  de novo pra reconectar.
                </>
              ) : (
                <>
                  <strong>{config.nome}</strong> parou de funcionar: {config.ultimo_erro}
                </>
              )}
            </div>
          ))}

        <AnunciosList anunciosIniciais={anuncios ?? []} configs={configs ?? []} />
      </main>
    </div>
  );
}
