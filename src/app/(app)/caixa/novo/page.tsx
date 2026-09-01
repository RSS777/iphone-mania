import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createLancamento } from "../actions";
import { LancamentoForm } from "../lancamento-form";
import type { CategoriaSaida } from "@/lib/caixa";

export default async function NovoLancamentoPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias_saida")
    .select("*")
    .order("nome")
    .returns<CategoriaSaida[]>();

  return (
    <div style={{ "--tint": "var(--nb-caixa)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <Link href="/caixa" className="text-[15px] font-semibold" style={{ color: "var(--nb-caixa)" }}>
          ‹ Caixa
        </Link>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Novo lançamento
        </h1>
      </header>

      <main className="px-4 pb-6">
        <LancamentoForm action={createLancamento} categorias={categorias ?? []} submitLabel="Lançar" />
      </main>
    </div>
  );
}
