import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { InlineTag } from "@/components/inline-tag";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, formatDataBR, type LancamentoCaixa } from "@/lib/caixa";

export default async function CaixaPage() {
  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("lancamentos_caixa")
    .select("*, categorias_saida(nome), profiles!socio_id(nome, email)")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<LancamentoCaixa[]>();

  const items = lancamentos ?? [];
  const saldo = items.reduce(
    (soma, l) => soma + (l.tipo === "entrada" ? Number(l.valor) : -Number(l.valor)),
    0,
  );

  function nomeSocio(l: LancamentoCaixa) {
    const nome = l.profiles?.nome ?? l.profiles?.email ?? "—";
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Fluxo de Caixa
            </h1>
            <p className="mt-3 font-ticket text-2xl font-bold text-ink">
              Saldo {formatBRL(saldo)}
            </p>
          </header>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft">Nenhum lançamento ainda.</p>
          ) : (
            <ul className="mt-6 flex flex-col">
              {items.map((l) => (
                <li key={l.id} className="border-b border-dashed border-paper-line py-4 first:pt-0 last:border-0">
                  <Link href={`/caixa/${l.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-base font-medium text-ink">{l.descricao}</p>
                      <p className="shrink-0 font-ticket text-base font-bold text-ink">
                        {l.tipo === "entrada" ? "+" : "−"} {formatBRL(Number(l.valor))}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <InlineTag tone={l.tipo === "entrada" ? "stamp" : "ink"}>
                        {l.tipo === "entrada" ? "Entrada" : l.categorias_saida?.nome ?? "Saída"}
                      </InlineTag>
                      <p className="truncate font-ticket text-xs text-ink-faint">
                        {formatDataBR(l.data)} · {nomeSocio(l)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/caixa/novo"
            className="mt-8 block w-full border-2 border-dashed border-paper-line py-4 text-center font-ticket text-sm font-bold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-stamp-dark hover:text-stamp-dark"
          >
            + Novo lançamento
          </Link>

          <p className="mt-4 text-center">
            <Link
              href="/caixa/categorias"
              className="font-ticket text-[10px] uppercase tracking-[0.14em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
            >
              Categorias de saída
            </Link>
          </p>
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="font-ticket text-[10px] uppercase tracking-[0.14em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            Voltar
          </Link>
        </p>
      </div>
    </main>
  );
}
