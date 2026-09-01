"use client";

import { useFormStatus } from "react-dom";
import { type ButtonHTMLAttributes } from "react";

type Variant = "filled" | "tinted" | "plain" | "destructive";

type NBButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  pendingLabel?: string;
  children: React.ReactNode;
};

/** Botão no estilo neobank — usa a cor --tint definida pelo contêiner da seção. */
export function NBButton({
  variant = "filled",
  pendingLabel,
  children,
  className = "",
  type = "button",
  disabled,
  ...rest
}: NBButtonProps) {
  const { pending } = useFormStatus();
  const isSubmit = type === "submit";
  const busy = isSubmit && pending;

  const base =
    "flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-opacity active:opacity-70 disabled:opacity-40";

  const variants: Record<Variant, string> = {
    filled: "text-[var(--nb-accent-ink)] shadow-[0_10px_24px_-8px_var(--tint)]",
    tinted: "bg-[color-mix(in_srgb,var(--tint)_16%,var(--nb-surface))] text-[var(--tint)]",
    plain: "text-[var(--tint)]",
    destructive: "text-[var(--nb-danger)]",
  };

  return (
    <button
      type={type}
      disabled={disabled || busy}
      style={variant === "filled" ? { backgroundColor: "var(--tint)" } : undefined}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {busy && pendingLabel ? pendingLabel : children}
    </button>
  );
}
