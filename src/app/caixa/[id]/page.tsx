import Link from "next/link";
import { notFound } from "next/navigation";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { DeleteConfirm } from "@/components/delete-confirm";
import { createClient } from "@/lib/supabase/server";
import { updateLancamento, deleteLancamento } from "../actions";
import { LancamentoForm } from "../lancamento-form";
import type { CategoriaSaida, LancamentoCaixa } from "@/lib/caixa";

type EditLancamentoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLancamentoPage({ params }: EditLancamentoPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: lancamento }, { data: categorias }] = await Promise.all([
    supabase.from("lancamentos_caixa").select("*").eq("id", id).single<LancamentoCaixa>(),
    supabase.from("categorias_saida").select("*").order("nome").returns<CategoriaSaida[]>(),
  ]);

  if (!lancamento) notFound();

  const boundUpdate = updateLancamento.bind(null, id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Lançamento
            </h1>
          </header>

          <LancamentoForm
            action={boundUpdate}
            categorias={categorias ?? []}
            defaultValues={lancamento}
            submitLabel="Salvar"
          />

          <div className="mt-8 border-t border-dashed border-paper-line pt-5">
            <DeleteConfirm
              label="Excluir lançamento"
              confirmMessage="Excluir esse lançamento apaga ele por completo do caixa. Confirma?"
              action={deleteLancamento.bind(null, id)}
            />
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
