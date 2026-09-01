import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { StatusTag } from "@/components/status-tag";
import { createClient } from "@/lib/supabase/server";
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
    // o trigger de cadastro usa o email como nome padrão; mostra só a parte antes do
    // @ pra não quebrar o layout com um domínio longo tipo "gmail.com".
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Em Avaliação / Estoque
            </h1>
          </header>

          {items.length === 0 ? (
            <p className="text-sm text-ink-soft">Nenhum iPhone cadastrado ainda.</p>
          ) : (
            <ul className="flex flex-col">
              {items.map((iphone) => (
                <li key={iphone.id} className="border-b border-dashed border-paper-line py-4 first:pt-0 last:border-0">
                  <Link href={`/estoque/${iphone.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-base font-medium text-ink">
                        {iphone.modelo} · {iphone.capacidade_gb}GB · {iphone.cor}
                      </p>
                      <StatusTag status={iphone.status} />
                    </div>
                    <p className="mt-1 truncate font-ticket text-xs text-ink-faint">
                      IMEI {iphone.imei} · {nomeSocio(iphone)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/estoque/novo"
            className="mt-8 block w-full border-2 border-dashed border-paper-line py-4 text-center font-ticket text-sm font-bold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-stamp-dark hover:text-stamp-dark"
          >
            + Novo item
          </Link>
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
