"use client";

import { useActionState } from "react";
import { advanceStatus } from "../actions";
import { StatusTag } from "@/components/status-tag";
import { GhostSubmit } from "@/components/ghost-submit";
import { ErrataNote } from "@/components/errata-note";
import { STATUS_LABEL, proximoStatus } from "@/lib/iphones";

const initialState = { error: null as string | null };

export function AdvanceStatus({ iphoneId, status }: { iphoneId: string; status: string }) {
  const action = advanceStatus.bind(null, iphoneId);
  const [state, formAction] = useActionState(action, initialState);
  const proximo = proximoStatus(status);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-ticket text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
          Status
        </span>
        <StatusTag status={status} />
      </div>

      {proximo ? (
        <form action={formAction}>
          <GhostSubmit
            idleLabel={`Avançar para "${STATUS_LABEL[proximo]}"`}
            pendingLabel="Avançando…"
          />
        </form>
      ) : (
        <p className="text-sm text-ink-soft">
          {status === "vendido" ? "Item já vendido." : "Esse item já está no último status manual."}
        </p>
      )}

      {state.error ? <ErrataNote>{state.error}</ErrataNote> : null}
    </div>
  );
}
