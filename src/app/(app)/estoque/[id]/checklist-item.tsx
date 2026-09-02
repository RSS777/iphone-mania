"use client";

import { useId, useState } from "react";

type ChecklistItemProps = {
  itemKey: string;
  label: string;
  como?: string;
  defaultChecked: boolean;
};

export function ChecklistItem({ itemKey, label, como, defaultChecked }: ChecklistItemProps) {
  const [aberto, setAberto] = useState(false);
  const painelId = useId();

  return (
    <div>
      <div className="flex items-center gap-3 text-[14.5px] text-[var(--nb-ink)]">
        <input
          id={itemKey}
          type="checkbox"
          name={itemKey}
          defaultChecked={defaultChecked}
          className="h-[18px] w-[18px] shrink-0 rounded-md border-[var(--nb-separator)] accent-[var(--nb-estoque)]"
        />
        <label htmlFor={itemKey} className="min-w-0 flex-1">
          {label}
        </label>
        {como ? (
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls={painelId}
            className="shrink-0 text-[12.5px] font-semibold"
            style={{ color: "var(--nb-estoque)" }}
          >
            {aberto ? "Ocultar" : "Como verificar"}
          </button>
        ) : null}
      </div>

      {como && aberto ? (
        <p
          id={painelId}
          className="mt-1.5 rounded-xl bg-[var(--nb-surface-2)] px-3 py-2 text-[13px] leading-relaxed text-[var(--nb-ink-secondary)]"
        >
          {como}
        </p>
      ) : null}
    </div>
  );
}
