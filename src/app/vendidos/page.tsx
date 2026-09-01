import Link from "next/link";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { createClient } from "@/lib/supabase/server";
import type { Iphone } from "@/lib/iphones";

type VendidosPageProps = {
  searchParams: Promise<{ modelo?: string; socio?: string; de?: string; ate?: string }>;
};

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDataBR(data: string | null) {
  if (!data) return "—";
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export default async function VendidosPage({ searchParams }: VendidosPageProps) {
  const { modelo, socio, de, ate } = await searchParams;
  const supabase = await createClient();

  const { data: socios } = await supabase.from("profiles").select("id, nome, email").order("email");

  let query = supabase
    .from("iphones")
    .select("*, profiles!socio_responsavel_id(nome, email)")
    .eq("status", "vendido")
    .order("data_venda", { ascending: false });

  if (modelo) query = query.ilike("modelo", `%${modelo}%`);
  if (socio) query = query.eq("socio_responsavel_id", socio);
  if (de) query = query.gte("data_venda", de);
  if (ate) query = query.lte("data_venda", ate);

  const { data: vendidos } = await query.returns<Iphone[]>();
  const items = vendidos ?? [];

  const ids = items.map((i) => i.id);
  const { data: custos } =
    ids.length > 0
      ? await supabase.from("custos_adicionais").select("iphone_id, valor").in("iphone_id", ids)
      : { data: [] as { iphone_id: string; valor: number }[] };

  const custosPorIphone = new Map<string, number>();
  for (const c of custos ?? []) {
    custosPorIphone.set(c.iphone_id, (custosPorIphone.get(c.iphone_id) ?? 0) + Number(c.valor));
  }

  function lucro(iphone: Iphone) {
    const totalCustos = custosPorIphone.get(iphone.id) ?? 0;
    return Number(iphone.valor_venda ?? 0) - (Number(iphone.valor_compra ?? 0) + totalCustos);
  }

  function nomeSocio(iphone: Iphone) {
    const nome = iphone.profiles?.nome ?? iphone.profiles?.email ?? "—";
    return nome.includes("@") ? nome.split("@")[0] : nome;
  }

  const temFiltro = Boolean(modelo || socio || de || ate);
  const lucroTotal = items.reduce((soma, i) => soma + lucro(i), 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              Vendidos
            </h1>
            {items.length > 0 ? (
              <p className="mt-2 font-ticket text-xl font-bold text-ink">
                Lucro do filtro {formatBRL(lucroTotal)}
              </p>
            ) : null}
          </header>

          <form method="get" className="mt-6 flex flex-col gap-4">
            <label htmlFor="modelo" className="block">
              <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                Modelo
              </span>
              <input
                id="modelo"
                name="modelo"
                defaultValue={modelo}
                placeholder="ex: iPhone 13"
                className="mt-2 w-full border-0 border-b-2 border-paper-line bg-transparent px-0 py-2 text-lg text-ink placeholder:text-ink-faint focus:border-stamp-dark focus:outline-none"
              />
            </label>

            <label htmlFor="socio" className="block">
              <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                Sócio
              </span>
              <select
                id="socio"
                name="socio"
                defaultValue={socio ?? ""}
                className="mt-2 w-full appearance-none border-0 border-b-2 border-paper-line bg-transparent bg-[length:12px_8px] bg-[position:right_2px_center] bg-no-repeat px-0 py-2 pr-6 text-lg text-ink focus:border-stamp-dark focus:outline-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2322201c' stroke-width='1.5'/%3E%3C/svg%3E\")",
                }}
              >
                <option value="">Todos</option>
                {(socios ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {(s.nome ?? s.email).includes("@") ? s.email.split("@")[0] : s.nome}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="de" className="block">
                <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                  Vendido de
                </span>
                <input
                  id="de"
                  name="de"
                  type="date"
                  defaultValue={de}
                  className="mt-2 w-full border-0 border-b-2 border-paper-line bg-transparent px-0 py-2 text-base text-ink focus:border-stamp-dark focus:outline-none"
                />
              </label>
              <label htmlFor="ate" className="block">
                <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                  até
                </span>
                <input
                  id="ate"
                  name="ate"
                  type="date"
                  defaultValue={ate}
                  className="mt-2 w-full border-0 border-b-2 border-paper-line bg-transparent px-0 py-2 text-base text-ink focus:border-stamp-dark focus:outline-none"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="font-ticket text-sm font-bold uppercase tracking-[0.14em] text-stamp-dark underline decoration-2 underline-offset-4"
              >
                Filtrar
              </button>
              {temFiltro ? (
                <Link
                  href="/vendidos"
                  className="font-ticket text-sm text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
                >
                  Limpar filtros
                </Link>
              ) : null}
            </div>
          </form>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft">
              {temFiltro ? "Nenhum item vendido bate com esse filtro." : "Nenhum iPhone vendido ainda."}
            </p>
          ) : (
            <ul className="mt-6 flex flex-col">
              {items.map((iphone) => (
                <li key={iphone.id} className="border-b border-dashed border-paper-line py-4 first:pt-0 last:border-0">
                  <Link href={`/estoque/${iphone.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-base font-medium text-ink">
                        {iphone.modelo} · {iphone.capacidade_gb}GB · {iphone.cor}
                      </p>
                      <p className="shrink-0 font-ticket text-base font-bold text-ink">
                        {formatBRL(lucro(iphone))}
                      </p>
                    </div>
                    <p className="mt-1 font-ticket text-xs text-ink-faint">
                      comprado {formatDataBR(iphone.data_compra)} · vendido {formatDataBR(iphone.data_venda)} ·{" "}
                      {nomeSocio(iphone)}
                    </p>
                    <p className="mt-0.5 font-ticket text-xs text-ink-faint">
                      compra {formatBRL(Number(iphone.valor_compra ?? 0))} + custos{" "}
                      {formatBRL(custosPorIphone.get(iphone.id) ?? 0)} · venda{" "}
                      {formatBRL(Number(iphone.valor_venda ?? 0))}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
