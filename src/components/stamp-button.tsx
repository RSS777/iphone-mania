"use client";

import { useFormStatus } from "react-dom";
import { type ButtonHTMLAttributes } from "react";

type StampButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  idleLabel: string;
  pendingLabel: string;
};

/** Botão de submit que se comporta como um carimbo de tinta batendo no papel. */
export function StampButton({ idleLabel, pendingLabel, className = "", ...rest }: StampButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`group relative w-full select-none p-2.5 transition-transform duration-150 ease-out active:scale-[0.94] disabled:cursor-wait ${className}`}
      style={{ transform: pending ? "rotate(0.5deg)" : "rotate(-2deg)" }}
      {...rest}
    >
      {/* anel externo, levemente desalinhado — imperfeição de carimbo batido à mão */}
      <span
        aria-hidden="true"
        className="ink-imperfect pointer-events-none absolute inset-0 border-2 border-stamp/70 [border-radius:255px_15px_225px_15px/15px_225px_15px_255px]"
        style={{ transform: "rotate(1.5deg)" }}
      />
      <span
        aria-hidden="true"
        className="ink-imperfect pointer-events-none absolute inset-[5px] border-[3px] border-stamp [border-radius:15px_225px_15px_255px/255px_15px_225px_15px] disabled:border-stamp-dark"
      />
      {/* mancha de tinta — carimbo nunca bate 100% uniforme */}
      <span
        aria-hidden="true"
        className="ink-imperfect pointer-events-none absolute -inset-1 opacity-[0.14] [background:radial-gradient(ellipse_60%_45%_at_38%_65%,var(--stamp)_0%,transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 [background:radial-gradient(circle_at_50%_50%,var(--stamp)_0%,transparent_70%)] transition-opacity duration-300 group-active:opacity-20"
      />
      <span
        className={`relative font-ticket text-lg font-bold uppercase tracking-[0.2em] ${
          pending ? "text-stamp-dark" : "text-stamp"
        }`}
      >
        {pending ? pendingLabel : idleLabel}
      </span>
    </button>
  );
}
