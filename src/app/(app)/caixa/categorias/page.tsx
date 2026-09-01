import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoriaRow } from "./categoria-row";
import { NovaCategoriaForm } from "./nova-categoria-form";
import type { CategoriaSaida } from "@/lib/caixa";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias_saida")
    .select("*")
    .order("nome")
    .returns<CategoriaSaida[]>();

  const items = categorias ?? [];

  return (
    <div style={{ "--tint": "var(--nb-caixa)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <Link href="/caixa" className="text-[15px] font-semibold" style={{ color: "var(--nb-caixa)" }}>
          ‹ Caixa
        </Link>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Categorias de saída
        </h1>
      </header>

      <main className="px-4 pb-6">
        {items.length === 0 ? (
          <p className="mt-6 text-[15px] text-[var(--nb-ink-secondary)]">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            {items.map((categoria) => (
              <CategoriaRow key={categoria.id} categoria={categoria} />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <NovaCategoriaForm />
        </div>
      </main>
    </div>
  );
}
