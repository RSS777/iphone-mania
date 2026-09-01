"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { descartarAnuncio, marcarAvaliado } from "./actions";
import type { ScrapingAnuncio } from "@/lib/garimpo";

function formatarPreco(valor: number | null) {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AnuncioCard({
  anuncio,
  onRemover,
}: {
  anuncio: ScrapingAnuncio;
  onRemover: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const precoCaiu = anuncio.preco_anterior != null && anuncio.preco != null && anuncio.preco < anuncio.preco_anterior;

  function descartar() {
    onRemover(anuncio.id);
    startTransition(async () => {
      await descartarAnuncio(anuncio.id);
    });
  }

  function enviarParaAvaliacao() {
    startTransition(async () => {
      await marcarAvaliado(anuncio.id);
      onRemover(anuncio.id);

      const params = new URLSearchParams();
      if (anuncio.titulo) params.set("modelo", anuncio.titulo);
      if (anuncio.preco != null) params.set("valor_compra", String(anuncio.preco));
      params.set("origem_compra", "OLX");
      params.set("observacoes", `Anúncio original: ${anuncio.link}`);

      router.push(`/estoque/novo?${params.toString()}`);
    });
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--nb-surface-2)]">
        {anuncio.imagem_capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={anuncio.imagem_capa} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <a
          href={anuncio.link}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 text-[14px] font-bold text-[var(--nb-ink)] underline decoration-[var(--nb-separator)] underline-offset-2"
        >
          {anuncio.titulo ?? "Anúncio sem título"}
        </a>

        <div className="mt-1 flex items-center gap-2 [font-variant-numeric:tabular-nums]">
          <span className="text-[15px] font-extrabold" style={{ color: "var(--tint)" }}>
            {formatarPreco(anuncio.preco)}
          </span>
          {precoCaiu ? (
            <>
              <span className="text-[12px] text-[var(--nb-ink-tertiary)] line-through">
                {formatarPreco(anuncio.preco_anterior)}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                style={{ backgroundColor: "color-mix(in srgb, var(--nb-estoque) 16%, transparent)", color: "var(--nb-estoque)" }}
              >
                preço caiu
              </span>
            </>
          ) : null}
        </div>

        {anuncio.localizacao ? (
          <p className="mt-0.5 truncate text-[12.5px] text-[var(--nb-ink-tertiary)]">{anuncio.localizacao}</p>
        ) : null}

        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={enviarParaAvaliacao}
            disabled={pending}
            className="text-[13px] font-bold disabled:opacity-50"
            style={{ color: "var(--tint)" }}
          >
            Enviar pra avaliação
          </button>
          <button
            type="button"
            onClick={descartar}
            disabled={pending}
            className="text-[13px] font-semibold text-[var(--nb-ink-tertiary)] disabled:opacity-50"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}
