"use client";

import { useActionState, useState, useRef } from "react";
import { addFotos, type FotoFormState } from "../actions";
import { ErrataNote } from "@/components/errata-note";
import { GhostSubmit } from "@/components/ghost-submit";

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
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="fotos" className="block">
        <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
          Adicionar fotos
        </span>
        <input
          ref={inputRef}
          id="fotos"
          name="fotos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="mt-2 block w-full text-sm text-ink file:mr-3 file:border file:border-dashed file:border-paper-line file:bg-transparent file:px-3 file:py-1.5 file:font-ticket file:text-xs file:font-bold file:uppercase file:tracking-[0.14em] file:text-ink-soft"
        />
      </label>

      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="aspect-square w-full border border-paper-line object-cover" />
          ))}
        </div>
      ) : null}

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}

      <GhostSubmit idleLabel="+ Subir fotos" pendingLabel="Subindo…" disabled={previews.length === 0} />
    </form>
  );
}
