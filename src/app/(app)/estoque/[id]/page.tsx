import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateIphone, updateChecklist, deleteCusto, deleteFoto } from "../actions";
import { IphoneForm } from "../iphone-form";
import { DeleteIphoneButton } from "./delete-button";
import { CustoForm } from "./custo-form";
import { FotoUploader } from "./foto-uploader";
import { AdvanceStatus } from "./advance-status";
import { VendaForm } from "./venda-form";
import { ChecklistItem } from "./checklist-item";
import { AnuncioGeradoView } from "./anuncio-gerado";
import { CHECKLIST_ITENS, fotoUrl, gerarAnuncio, type Iphone, type CustoAdicional, type IphoneFoto } from "@/lib/iphones";
import { NBButton } from "@/components/nb/button";

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
  const lucro =
    iphone.status === "vendido" && iphone.valor_venda != null
      ? Number(iphone.valor_venda) - (Number(iphone.valor_compra ?? 0) + totalCustos)
      : null;
  const anuncio = gerarAnuncio(iphone);

  return (
    <div style={{ "--tint": "var(--nb-estoque)" } as React.CSSProperties} className="font-nb">
      <header className="nb-navbar-blur sticky top-0 z-30 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/estoque" className="shrink-0 text-[14px] font-semibold" style={{ color: "var(--nb-estoque)" }}>
            ‹ Voltar
          </Link>
          <h1 className="truncate text-[20px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
            {iphone.modelo}
          </h1>
          <span className="w-[52px] shrink-0" aria-hidden="true" />
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 pb-6">
        <AdvanceStatus iphoneId={id} status={iphone.status} />

        {iphone.status === "a_venda" ? (
          <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
              Registrar venda
            </h2>
            <div className="mt-3">
              <VendaForm iphoneId={id} />
            </div>
          </section>
        ) : null}

        {iphone.status === "vendido" ? (
          <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
              Venda
            </h2>
            <div className="mt-3 flex flex-col gap-1">
              <p className="text-[15px] text-[var(--nb-ink)] [font-variant-numeric:tabular-nums]">
                Vendido por R$ {Number(iphone.valor_venda).toFixed(2)}
                {iphone.data_venda
                  ? ` em ${new Date(iphone.data_venda + "T00:00:00").toLocaleDateString("pt-BR")}`
                  : ""}
                {iphone.canal_venda ? ` · ${iphone.canal_venda}` : ""}
              </p>
              <p
                className="text-[18px] font-bold [font-variant-numeric:tabular-nums]"
                style={{ color: "var(--nb-lucro)" }}
              >
                Lucro R$ {lucro?.toFixed(2)}
              </p>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Dados do iPhone
          </h2>
          <div className="mt-3">
            <IphoneForm action={boundUpdate} defaultValues={iphone} submitLabel="Salvar" pendingLabel="Salvando…" />
          </div>
        </section>

        {/* Checklist de avaliação */}
        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Checklist de avaliação
          </h2>
          <p className="mt-1 text-[13px] text-[var(--nb-ink-secondary)]">Informativo — não bloqueia nada.</p>

          <form action={boundChecklist} className="mt-3 flex flex-col gap-3">
            {CHECKLIST_ITENS.map((item) => (
              <ChecklistItem
                key={item.key}
                itemKey={item.key}
                label={item.label}
                como={"como" in item ? item.como : undefined}
                defaultChecked={Boolean(iphone.checklist?.[item.key])}
              />
            ))}

            <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface-2)] px-4 py-3">
              <label
                htmlFor="observacao_checklist"
                className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
              >
                Observação
              </label>
              <textarea
                id="observacao_checklist"
                name="observacao_checklist"
                rows={3}
                defaultValue={iphone.observacao_checklist ?? undefined}
                placeholder="Algo que reparou na avaliação e não está na lista acima…"
                className="mt-1 w-full resize-y bg-transparent text-[15px] text-[var(--nb-ink)] placeholder:text-[var(--nb-ink-tertiary)] focus:outline-none"
              />
            </div>

            <NBButton type="submit" variant="tinted" pendingLabel="Salvando…" className="mt-2">
              Salvar checklist
            </NBButton>
          </form>
        </section>

        {/* Anúncio gerado (OLX/Facebook) */}
        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Anúncio pra postar
          </h2>
          <div className="mt-3">
            <AnuncioGeradoView titulo={anuncio.titulo} descricao={anuncio.descricao} />
          </div>
        </section>

        {/* Custos adicionais */}
        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
              Custos adicionais
            </h2>
            {custos && custos.length > 0 ? (
              <span className="text-[13px] text-[var(--nb-ink-secondary)] [font-variant-numeric:tabular-nums]">
                total R$ {totalCustos.toFixed(2)}
              </span>
            ) : null}
          </div>

          {custos && custos.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {custos.map((custo) => (
                <li
                  key={custo.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[var(--nb-surface-2)] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] text-[var(--nb-ink)]">{custo.descricao}</p>
                    <p className="text-[12.5px] text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">
                      R$ {Number(custo.valor).toFixed(2)} ·{" "}
                      {new Date(custo.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <form action={deleteCusto.bind(null, custo.id, id)}>
                    <button
                      type="submit"
                      className="shrink-0 text-[13px] font-semibold"
                      style={{ color: "var(--nb-danger)" }}
                    >
                      Remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] text-[var(--nb-ink-secondary)]">Nenhum custo adicional ainda.</p>
          )}

          <div className="mt-4">
            <CustoForm iphoneId={id} />
          </div>
        </section>

        {/* Fotos */}
        <section className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
            Fotos
          </h2>

          {fotos && fotos.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {fotos.map((foto) => (
                <div key={foto.id} className="flex flex-col gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoUrl(foto.path)}
                    alt=""
                    className="aspect-square w-full rounded-xl border border-[var(--nb-separator)] object-cover"
                  />
                  <form action={deleteFoto.bind(null, foto.id, foto.path, id)}>
                    <button
                      type="submit"
                      className="w-full text-[11.5px] font-semibold"
                      style={{ color: "var(--nb-danger)" }}
                    >
                      Remover
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[14px] text-[var(--nb-ink-secondary)]">Nenhuma foto ainda.</p>
          )}

          <div className="mt-4">
            <FotoUploader iphoneId={id} />
          </div>
        </section>

        <DeleteIphoneButton id={id} />
      </main>
    </div>
  );
}
