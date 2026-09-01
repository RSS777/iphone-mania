"use client";

import { useActionState, useState, useRef } from "react";
import { addFotos, type FotoFormState } from "../actions";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: FotoFormState = { error: null };

export function FotoUploader({ iphoneId }: { iphoneId: string }) {
  const action = addFotos.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange() {
    const files = inputRef.current?.files;
    previews.forEach((url) => URL.revokeObjectURL(url));
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }
    setPreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label
        htmlFor="fotos"
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-5 text-center"
      >
        <span className="text-[14px] font-semibold" style={{ color: "var(--tint)" }}>
          Adicionar fotos
        </span>
        <span className="text-[12.5px] text-[var(--nb-ink-tertiary)]">Toque pra escolher imagens</span>
        <input
          ref={inputRef}
          id="fotos"
          name="fotos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="aspect-square w-full rounded-xl border border-[var(--nb-separator)] object-cover"
            />
          ))}
        </div>
      ) : null}

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" variant="tinted" pendingLabel="Subindo…" disabled={previews.length === 0}>
        + Subir fotos
      </NBButton>
    </form>
  );
}
