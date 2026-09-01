import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnunciosList } from "./anuncios-list";
import type { ScrapingAnuncio, ScrapingConfig } from "@/lib/garimpo";

export default async function GarimpoPage() {
  const supabase = await createClient();
  const [{ data: anuncios }, { data: configs }] = await Promise.all([
    supabase
      .from("scraping_anuncios")
      .select("*")
      .eq("status", "novo")
      .order("atualizado_em", { ascending: false })
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
        <AnunciosList anunciosIniciais={anuncios ?? []} configs={configs ?? []} />
      </main>
    </div>
  );
}
