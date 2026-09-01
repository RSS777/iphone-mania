"use client";

import { useEffect, useState } from "react";
import { NBErrorBanner } from "@/components/nb/error-banner";
import { NBButton } from "@/components/nb/button";

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
    <main
      className="font-nb flex min-h-screen flex-col items-center justify-center bg-[var(--nb-bg)] px-6 py-12"
      style={{ "--tint": "var(--nb-danger)" } as React.CSSProperties}
    >
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-[24px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
          {offline ? "Sem conexão" : "Algo deu errado"}
        </h1>

        <NBErrorBanner>
          {offline
            ? "Essa ação precisa de internet pra funcionar. Os dados já carregados continuam disponíveis pra consulta, mas criar, editar ou excluir só funciona com conexão. Verifique sua internet e tente de novo."
            : "Não deu pra completar essa ação. Tenta de novo — se continuar acontecendo, avisa o sócio que mexe com o app."}
        </NBErrorBanner>

        <NBButton type="button" variant="tinted" onClick={() => reset()} className="mt-4">
          Tentar de novo
        </NBButton>
      </div>
    </main>
  );
}
