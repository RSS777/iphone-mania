import Link from "next/link";
import { notFound } from "next/navigation";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { createClient } from "@/lib/supabase/server";
import { updateIphone } from "../actions";
import { IphoneForm } from "../iphone-form";
import { DeleteIphoneButton } from "./delete-button";
import type { Iphone } from "@/lib/iphones";

type EditIphonePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditIphonePage({ params }: EditIphonePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: iphone } = await supabase
    .from("iphones")
    .select("*")
    .eq("id", id)
    .single<Iphone>();

  if (!iphone) notFound();

  const boundUpdate = updateIphone.bind(null, id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              {iphone.modelo}
            </h1>
          </header>

          <IphoneForm
            action={boundUpdate}
            defaultValues={iphone}
            submitLabel="Salvar"
            pendingLabel="Carimbando…"
          />

          <div className="mt-8 border-t border-dashed border-paper-line pt-5">
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
