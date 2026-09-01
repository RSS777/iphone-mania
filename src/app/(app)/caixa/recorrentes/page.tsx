import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RecorrenteRow } from "./recorrente-row";
import type { SaidaRecorrente } from "@/lib/caixa";

export default async function RecorrentesPage() {
  const supabase = await createClient();
  const { data: recorrentes } = await supabase
    .from("saidas_recorrentes")
    .select("*, categorias_saida(nome)")
    .order("descricao")
    .returns<SaidaRecorrente[]>();

  const items = recorrentes ?? [];

  return (
    <div style={{ "--tint": "var(--nb-caixa)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <Link href="/caixa" className="text-[15px] font-semibold" style={{ color: "var(--nb-caixa)" }}>
          ‹ Caixa
        </Link>
        <h1 className="mt-1 text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Saídas recorrentes
        </h1>
        <p className="mt-1 text-[13px] text-[var(--nb-ink-secondary)]">
          Lançadas sozinhas à meia-noite do dia de vencimento, todo mês.
        </p>
      </header>

      <main className="px-4 pb-6">
        {items.length === 0 ? (
          <p className="mt-6 text-[15px] text-[var(--nb-ink-secondary)]">Nenhuma saída recorrente cadastrada ainda.</p>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            {items.map((r) => (
              <RecorrenteRow key={r.id} recorrente={r} />
            ))}
          </div>
        )}

        <Link
          href="/caixa/recorrentes/novo"
          className="mt-6 flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-[15px] font-bold text-[var(--nb-accent-ink)] active:opacity-70"
          style={{
            backgroundColor: "var(--nb-caixa)",
            boxShadow: "0 10px 24px -8px var(--nb-caixa)",
          }}
        >
          + Nova recorrência
        </Link>
      </main>
    </div>
  );
}
