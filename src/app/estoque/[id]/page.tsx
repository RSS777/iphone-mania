import Link from "next/link";
import { notFound } from "next/navigation";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { GhostSubmit } from "@/components/ghost-submit";
import { createClient } from "@/lib/supabase/server";
import { updateIphone, updateChecklist, deleteCusto, deleteFoto } from "../actions";
import { IphoneForm } from "../iphone-form";
import { DeleteIphoneButton } from "./delete-button";
import { CustoForm } from "./custo-form";
import { FotoUploader } from "./foto-uploader";
import { AdvanceStatus } from "./advance-status";
import { CHECKLIST_ITENS, fotoUrl, type Iphone, type CustoAdicional, type IphoneFoto } from "@/lib/iphones";

type EditIphonePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditIphonePage({ params }: EditIphonePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: iphone }, { data: custos }, { data: fotos }] = await Promise.all([
    supabase.from("iphones").select("*").eq("id", id).single<Iphone>(),
    supabase
      .from("custos_adicionais")
      .select("*")
      .eq("iphone_id", id)
      .order("data", { ascending: false })
      .returns<CustoAdicional[]>(),
    supabase
      .from("iphone_fotos")
      .select("*")
      .eq("iphone_id", id)
      .order("ordem", { ascending: true })
      .returns<IphoneFoto[]>(),
  ]);

  if (!iphone) notFound();

  const boundUpdate = updateIphone.bind(null, id);
  const boundChecklist = updateChecklist.bind(null, id);
  const totalCustos = (custos ?? []).reduce((soma, c) => soma + Number(c.valor), 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative flex flex-col gap-8 bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              {iphone.modelo}
            </h1>
          </header>

          <AdvanceStatus iphoneId={id} status={iphone.status} />

          <IphoneForm
            action={boundUpdate}
            defaultValues={iphone}
            submitLabel="Salvar"
            pendingLabel="Carimbando…"
          />

          {/* Checklist de avaliação */}
          <section className="border-t border-dashed border-paper-line pt-6">
            <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              Checklist de avaliação
            </h2>
            <p className="mt-1 text-sm text-ink-soft">Informativo — não bloqueia nada.</p>

            <form action={boundChecklist} className="mt-4 flex flex-col gap-3">
              {CHECKLIST_ITENS.map((item) => (
                <label key={item.key} className="flex items-center gap-3 text-sm text-ink">
                  <input
                    id={item.key}
                    type="checkbox"
                    name={item.key}
                    defaultChecked={Boolean(iphone.checklist?.[item.key])}
                    className="h-4 w-4 shrink-0 accent-stamp"
                  />
                  {item.label}
                </label>
              ))}
              <GhostSubmit idleLabel="Salvar checklist" pendingLabel="Salvando…" className="mt-2" />
            </form>
          </section>

          {/* Custos adicionais */}
          <section className="border-t border-dashed border-paper-line pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                Custos adicionais
              </h2>
              {custos && custos.length > 0 ? (
                <span className="font-ticket text-xs text-ink-faint">
                  total R$ {totalCustos.toFixed(2)}
                </span>
              ) : null}
            </div>

            {custos && custos.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {custos.map((custo) => (
                  <li
                    key={custo.id}
                    className="flex items-center justify-between gap-3 border-b border-dashed border-paper-line pb-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{custo.descricao}</p>
                      <p className="font-ticket text-xs text-ink-faint">
                        R$ {Number(custo.valor).toFixed(2)} ·{" "}
                        {new Date(custo.data + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <form action={deleteCusto.bind(null, custo.id, id)}>
                      <button
                        type="submit"
                        className="shrink-0 font-ticket text-xs uppercase tracking-[0.1em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-errata"
                      >
                        Remover
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">Nenhum custo adicional ainda.</p>
            )}

            <div className="mt-5">
              <CustoForm iphoneId={id} />
            </div>
          </section>

          {/* Fotos */}
          <section className="border-t border-dashed border-paper-line pt-6">
            <h2 className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              Fotos
            </h2>

            {fotos && fotos.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {fotos.map((foto) => (
                  <div key={foto.id} className="group relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoUrl(foto.path)}
                      alt=""
                      className="h-full w-full border border-paper-line object-cover"
                    />
                    <form
                      action={deleteFoto.bind(null, foto.id, foto.path, id)}
                      className="absolute inset-x-0 bottom-0"
                    >
                      <button
                        type="submit"
                        className="w-full bg-paper/90 font-ticket text-[10px] uppercase tracking-[0.1em] text-ink-faint hover:text-errata"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">Nenhuma foto ainda.</p>
            )}

            <div className="mt-5">
              <FotoUploader iphoneId={id} />
            </div>
          </section>

          <div className="border-t border-dashed border-paper-line pt-5">
            <DeleteIphoneButton id={id} />
          </div>
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />

        <p className="mt-4 text-center">
          <Link
            href="/estoque"
            className="font-ticket text-[10px] uppercase tracking-[0.14em] text-ink-faint underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            Voltar pro estoque
          </Link>
        </p>
      </div>
    </main>
  );
}
