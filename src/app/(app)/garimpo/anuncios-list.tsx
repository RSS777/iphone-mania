"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnuncioCard } from "./anuncio-card";
import type { ScrapingAnuncio, ScrapingConfig } from "@/lib/garimpo";

type AnunciosListProps = {
  anunciosIniciais: ScrapingAnuncio[];
  configs: ScrapingConfig[];
};

export function AnunciosList({ anunciosIniciais, configs }: AnunciosListProps) {
  const [anuncios, setAnuncios] = useState<ScrapingAnuncio[]>(anunciosIniciais);
  const [configFiltro, setConfigFiltro] = useState<string>("todos");

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelado = false;

    // O cliente do navegador (via @supabase/ssr) não propaga sozinho o token da sessão
    // pro socket do Realtime quando a sessão já vem de cookies (SSR) em vez de um sign-in
    // client-side — sem isso, a policy RLS de "authenticated" nunca casa e os eventos
    // somem em silêncio. Precisa setar o token explicitamente antes de assinar o canal.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelado) return;
      if (session) supabase.realtime.setAuth(session.access_token);

      channel = supabase
        .channel("scraping_anuncios_novos")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "scraping_anuncios" },
          (payload) => {
            const linha = payload.new as ScrapingAnuncio | undefined;
            if (!linha) return;

            setAnuncios((atuais) => {
              const semEsse = atuais.filter((a) => a.id !== linha.id);
              if (linha.status !== "novo") return semEsse;
              return [linha, ...semEsse].sort((a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity));
            });
          },
        )
        .subscribe();
    });

    return () => {
      cancelado = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const anunciosFiltrados = useMemo(
    () => (configFiltro === "todos" ? anuncios : anuncios.filter((a) => a.config_id === configFiltro)),
    [anuncios, configFiltro],
  );

  function removerLocal(id: string) {
    setAnuncios((atuais) => atuais.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {configs.length > 0 ? (
        <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3">
          <label
            htmlFor="config-filtro"
            className="block text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]"
          >
            Filtrar por busca
          </label>
          <select
            id="config-filtro"
            value={configFiltro}
            onChange={(e) => setConfigFiltro(e.target.value)}
            className="mt-1 w-full bg-transparent text-[15px] text-[var(--nb-ink)] focus:outline-none [color-scheme:dark]"
          >
            <option value="todos">Todas</option>
            {configs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {anunciosFiltrados.length === 0 ? (
        <p className="mt-6 text-[15px] text-[var(--nb-ink-secondary)]">
          Nenhum anúncio novo por enquanto. O garimpo roda automaticamente a cada 20 minutos.
        </p>
      ) : (
        <div className="mt-1 flex flex-col gap-3">
          {anunciosFiltrados.map((anuncio) => (
            <AnuncioCard key={anuncio.id} anuncio={anuncio} onRemover={removerLocal} />
          ))}
        </div>
      )}
    </div>
  );
}
