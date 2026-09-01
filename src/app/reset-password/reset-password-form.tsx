"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePassword, type ResetPasswordState } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialState: ResetPasswordState = { error: null };

type SessionStatus = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, initialState);
  const [status, setStatus] = useState<SessionStatus>("checking");

  useEffect(() => {
    const supabase = createClient();

    async function establishSession() {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        // limpa o hash da URL pra não deixar o token exposto nem reprocessar num refresh.
        window.history.replaceState(null, "", window.location.pathname);
        setStatus(error ? "invalid" : "ready");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setStatus(session ? "ready" : "invalid");
    }

    establishSession();
  }, []);

  if (status === "checking") {
    return <p className="text-[14px] text-[var(--nb-ink-secondary)]">Conferindo o link…</p>;
  }

  if (status === "invalid") {
    return (
      <NBErrorBanner>
        Esse link de recuperação já foi usado ou expirou. Peça um novo em &ldquo;Esqueci minha
        senha&rdquo; na tela de login.
      </NBErrorBanner>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-3">
      <NBTextRow id="password" name="password" type="password" label="Nova senha" autoComplete="new-password" required />
      <NBTextRow
        id="confirmation"
        name="confirmation"
        type="password"
        label="Confirmar nova senha"
        autoComplete="new-password"
        required
      />

      {state.error ? <NBErrorBanner>{state.error}</NBErrorBanner> : null}

      <NBButton type="submit" pendingLabel="Trocando…" className="mt-1">
        Trocar senha
      </NBButton>
    </form>
  );
}
