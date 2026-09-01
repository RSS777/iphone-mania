import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateLancamento, deleteLancamento } from "../actions";
import { LancamentoForm } from "../lancamento-form";
import { DeleteLancamentoButton } from "./delete-lancamento-button";
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
    <div style={{ "--tint": "var(--nb-caixa)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <Link href="/caixa" className="text-[15px] font-semibold" style={{ color: "var(--nb-caixa)" }}>
          ‹ Caixa
        </Link>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Lançamento
        </h1>
      </header>

      <main className="px-4 pb-6">
        <LancamentoForm
          action={boundUpdate}
          categorias={categorias ?? []}
          defaultValues={lancamento}
          submitLabel="Salvar"
        />

        <div className="mt-6 flex justify-center">
          <DeleteLancamentoButton action={deleteLancamento.bind(null, id)} />
        </div>
      </main>
    </div>
  );
}
