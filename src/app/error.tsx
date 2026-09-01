"use client";

import { useEffect, useState } from "react";
import { TornEdge } from "@/components/torn-edge";
import { MetalClip } from "@/components/metal-clip";
import { ErrataNote } from "@/components/errata-note";

function pareceFalhaDeRede(error: Error) {
  const msg = error.message?.toLowerCase() ?? "";
  return msg.includes("fetch") || msg.includes("network") || msg.includes("failed to fetch");
}

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine || pareceFalhaDeRede(error));
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-carbon-backdrop px-6 py-12">
      <div className="relative w-full max-w-sm">
        <MetalClip className="absolute -top-4 left-1/2 z-10 h-9 w-14 -translate-x-1/2" />
        <TornEdge className="h-3.5 w-full text-paper" />

        <div className="carbon-texture relative bg-paper px-7 pb-9 pt-6 shadow-[0_1px_0_var(--paper-line),0_18px_36px_-24px_rgb(34_32_28_/_45%)]">
          <header className="mb-6 border-b border-dashed border-paper-line pb-5">
            <h1 className="ink-title font-ticket text-3xl font-bold tracking-tight text-ink">
              {offline ? "Sem conexão" : "Algo deu errado"}
            </h1>
          </header>

          <ErrataNote>
            {offline
              ? "Essa ação precisa de internet pra funcionar. Os dados já carregados continuam disponíveis pra consulta, mas criar, editar ou excluir só funciona com conexão. Verifique sua internet e tente de novo."
              : "Não deu pra completar essa ação. Tenta de novo — se continuar acontecendo, avisa o sócio que mexe com o app."}
          </ErrataNote>

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 font-ticket text-sm font-bold uppercase tracking-[0.14em] text-stamp-dark underline decoration-2 underline-offset-4"
          >
            Tentar de novo
          </button>
        </div>

        <TornEdge flip className="h-3.5 w-full text-paper" />
      </div>
    </main>
  );
}
