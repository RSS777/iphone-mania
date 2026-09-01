import Link from "next/link";
import { NBGroup, NBRow } from "@/components/nb/list";
import { CaixaIcon, PlusIcon } from "@/components/icons";
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
    if (!l.socio_id) return l.origem === "recorrencia" ? "recorrência automática" : "sistema";
    const nome = l.profiles?.nome ?? l.profiles?.email ?? "—";
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  return (
    <div style={{ "--tint": "var(--nb-caixa)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          Caixa
        </h1>
      </header>

      <Link
        href="/caixa/novo"
        aria-label="Novo lançamento"
        className="nb-fab fixed left-1/2 z-50 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full active:opacity-80"
        style={{
          background: "linear-gradient(135deg, var(--nb-caixa), #9db4ff)",
          color: "var(--nb-accent-ink)",
          boxShadow: "0 14px 28px -8px color-mix(in srgb, var(--nb-caixa) 55%, transparent)",
        }}
      >
        <PlusIcon className="h-7 w-7" />
      </Link>

      <main className="px-4 pb-6">
        <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-5 py-6">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">Saldo</p>
          <p className="mt-1 text-[34px] font-bold text-[var(--nb-ink)] [font-variant-numeric:tabular-nums] [font-family:var(--font-display)]">
            {formatBRL(saldo)}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/caixa/categorias"
            className="flex items-center justify-center rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] py-3 text-[13px] font-semibold active:opacity-80"
            style={{ color: "var(--nb-caixa)" }}
          >
            Categorias de saída
          </Link>
          <Link
            href="/caixa/recorrentes"
            className="flex items-center justify-center rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] py-3 text-[13px] font-semibold active:opacity-80"
            style={{ color: "var(--nb-caixa)" }}
          >
            Saídas recorrentes
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <CaixaIcon className="h-12 w-12 text-[var(--nb-ink-tertiary)]" />
            <p className="text-[15px] text-[var(--nb-ink-secondary)]">Nenhum lançamento ainda.</p>
          </div>
        ) : (
          <NBGroup>
            {items.map((l) => (
              <NBRow
                key={l.id}
                href={`/caixa/${l.id}`}
                title={l.descricao}
                subtitle={`${formatDataBR(l.data)} · ${l.tipo === "entrada" ? "Entrada" : l.categorias_saida?.nome ?? "Saída"} · ${nomeSocio(l)}`}
                trailing={
                  <span
                    className="[font-variant-numeric:tabular-nums]"
                    style={{ color: l.tipo === "entrada" ? "var(--nb-caixa)" : "var(--nb-danger)" }}
                  >
                    {l.tipo === "entrada" ? "+ " : "− "}
                    {formatBRL(Number(l.valor))}
                  </span>
                }
              />
            ))}
          </NBGroup>
        )}
      </main>
    </div>
  );
}
