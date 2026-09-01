import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ConfigRow } from "../config-row";
import { ConfigForm } from "../config-form";
import type { ScrapingConfig } from "@/lib/garimpo";

export default async function ConfigurarGarimpoPage() {
  const supabase = await createClient();
  const { data: configs } = await supabase
    .from("scraping_configs")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ScrapingConfig[]>();

  const items = configs ?? [];

  return (
    <div style={{ "--tint": "var(--nb-garimpo)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <Link href="/garimpo" className="text-[14px] font-semibold" style={{ color: "var(--nb-garimpo)" }}>
          ‹ Garimpo
        </Link>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Configurar garimpo
        </h1>
      </header>

      <main className="px-4 pb-6">
        {items.length === 0 ? (
          <p className="mt-6 text-[15px] text-[var(--nb-ink-secondary)]">Nenhuma busca cadastrada ainda.</p>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            {items.map((config) => (
              <ConfigRow key={config.id} config={config} />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Nova busca
          </h2>
          <ConfigForm />
        </div>
      </main>
    </div>
  );
}
