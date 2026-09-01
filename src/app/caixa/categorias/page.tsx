import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Categorias de saída
            </h1>
          </header>

          {items.length === 0 ? (
            <p className="text-sm text-ink-soft">Nenhuma categoria cadastrada ainda.</p>
          ) : (
            <div className="flex flex-col">
              {items.map((categoria) => (
                <CategoriaRow key={categoria.id} categoria={categoria} />
              ))}
            </div>
          )}

          <div className="mt-6">
            <NovaCategoriaForm />
          </div>
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
