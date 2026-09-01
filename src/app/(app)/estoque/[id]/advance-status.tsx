"use client";

import { useActionState } from "react";
import { advanceStatus } from "../actions";
import { NBStatusPill } from "@/components/nb/status-pill";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";
import { STATUS_LABEL, proximoStatus } from "@/lib/iphones";

const initialState = { error: null as string | null };

export function AdvanceStatus({ iphoneId, status }: { iphoneId: string; status: string }) {
  const action = advanceStatus.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);
  const proximo = proximoStatus(status);

  return (
    <div className="rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--nb-ink-tertiary)]">
          Status
        </span>
        <NBStatusPill status={status} />
      </div>

      {proximo ? (
        <form action={formAction} className="mt-3">
          <NBButton type="submit" variant="tinted" pendingLabel="Avançando…">
            {`Avançar para "${STATUS_LABEL[proximo]}"`}
          </NBButton>
        </form>
      ) : (
        <p className="mt-3 text-[14px] text-[var(--nb-ink-secondary)]">
          {status === "vendido" ? "Item já vendido." : "Esse item já está no último status manual."}
        </p>
      )}

      {state.error ? (
        <div className="mt-3">
          <NBErrorBanner>{state.error}</NBErrorBanner>
        </div>
      ) : null}
    </div>
  );
}
