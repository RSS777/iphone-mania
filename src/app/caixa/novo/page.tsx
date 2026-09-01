import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Novo lançamento
            </h1>
          </header>

          <LancamentoForm action={createLancamento} categorias={categorias ?? []} submitLabel="Lançar" />
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />

        <p className="mt-4 text-center">
          <Link
            href="/caixa"
            className="font-ticket text-[10px] uppercase tracking-[0.14em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            Voltar pro caixa
          </Link>
        </p>
      </div>
    </main>
  );
}
