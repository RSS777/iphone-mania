import Link from "next/link";
import { NBGroup, NBRow } from "@/components/nb/list";
import { NBStatusPill } from "@/components/nb/status-pill";
import { EstoqueIcon, PlusIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import type { Iphone } from "@/lib/iphones";

export default async function EstoquePage() {
  const supabase = await createClient();
  const { data: iphones } = await supabase
    .from("iphones")
    .select("*, profiles!socio_responsavel_id(nome, email)")
    .order("created_at", { ascending: false })
    .returns<Iphone[]>();

  const items = iphones ?? [];

  function nomeSocio(iphone: Iphone) {
    const nome = iphone.profiles?.nome ?? iphone.profiles?.email ?? "—";
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  return (
    <div style={{ "--tint": "var(--nb-estoque)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
            Estoque
          </h1>
          <form action={signOut}>
            <button type="submit" className="text-[14px] font-semibold" style={{ color: "var(--nb-danger)" }}>
              Sair
            </button>
          </form>
        </div>
      </header>

      <Link
        href="/estoque/novo"
        aria-label="Novo iPhone"
        className="nb-fab fixed left-1/2 z-50 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full active:opacity-80"
        style={{
          background: "linear-gradient(135deg, var(--nb-estoque), #23c9c9)",
          color: "var(--nb-accent-ink)",
          boxShadow: "0 14px 28px -8px color-mix(in srgb, var(--nb-estoque) 55%, transparent)",
        }}
      >
        <PlusIcon className="h-7 w-7" />
      </Link>

      <main className="px-4 pb-6">
        {items.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <EstoqueIcon className="h-12 w-12 text-[var(--nb-ink-tertiary)]" />
            <p className="text-[15px] text-[var(--nb-ink-secondary)]">
              Nenhum iPhone cadastrado ainda.
              <br />
              Toque em + pra começar uma avaliação.
            </p>
          </div>
        ) : (
          <NBGroup>
            {items.map((iphone) => (
              <NBRow
                key={iphone.id}
                href={`/estoque/${iphone.id}`}
                title={`${iphone.modelo} · ${iphone.capacidade_gb}GB · ${iphone.cor}`}
                subtitle={`IMEI ${iphone.imei} · ${nomeSocio(iphone)}`}
                trailing={<NBStatusPill status={iphone.status} />}
              />
            ))}
          </NBGroup>
        )}
      </main>
    </div>
  );
}
