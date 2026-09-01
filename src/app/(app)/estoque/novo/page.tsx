import Link from "next/link";
import { createIphone } from "../actions";
import { IphoneForm } from "../iphone-form";
import type { Iphone } from "@/lib/iphones";

type NovoIphonePageProps = {
  searchParams: Promise<{ modelo?: string; valor_compra?: string; origem_compra?: string; observacoes?: string }>;
};

export default async function NovoIphonePage({ searchParams }: NovoIphonePageProps) {
  const params = await searchParams;

  const prefill: Partial<Iphone> | undefined =
    params.modelo || params.valor_compra || params.origem_compra || params.observacoes
      ? {
          modelo: params.modelo,
          valor_compra: params.valor_compra ? Number(params.valor_compra) : null,
          origem_compra: params.origem_compra,
          observacoes: params.observacoes ?? null,
        }
      : undefined;

  return (
    <div style={{ "--tint": "var(--nb-estoque)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <Link href="/estoque" className="text-[14px] font-semibold" style={{ color: "var(--nb-estoque)" }}>
            ‹ Voltar
          </Link>
          <h1 className="text-[17px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
            Novo item
          </h1>
          <span className="w-[52px]" aria-hidden="true" />
        </div>
        <p className="mt-1 text-center text-[13px] text-[var(--nb-ink-secondary)]">Entra em &ldquo;Avaliando&rdquo;.</p>
      </header>

      <main className="px-4 pb-6">
        <IphoneForm
          action={createIphone}
          defaultValues={prefill}
          submitLabel="Cadastrar"
          pendingLabel="Cadastrando…"
        />
      </main>
    </div>
  );
}
