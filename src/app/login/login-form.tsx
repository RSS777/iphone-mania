"use client";

import { useActionState, useState } from "react";
import { signIn, requestPasswordReset, type LoginState, type ForgotPasswordState } from "./actions";
import { TicketField } from "@/components/ticket-field";
import { StampButton } from "@/components/stamp-button";
import { ErrataNote } from "@/components/errata-note";

const initialLoginState: LoginState = { error: null, email: "" };
const initialForgotState: ForgotPasswordState = { status: "idle", error: null };

export function LoginForm() {
  const [loginState, loginAction] = useActionState(signIn, initialLoginState);
  const [forgotState, forgotAction] = useActionState(requestPasswordReset, initialForgotState);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <form action={loginAction} className="flex flex-col gap-6">
        <TicketField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="username"
          defaultValue={loginState.email}
          required
        />
        <TicketField
          id="password"
          name="password"
          type="password"
          label="Senha"
          autoComplete="current-password"
          required
        />

        {loginState.error ? <ErrataNote>{loginState.error}</ErrataNote> : null}

        <StampButton idleLabel="Entrar" pendingLabel="Carimbando…" />
      </form>

      <div className="mt-6 border-t border-dashed border-paper-line pt-4 text-center">
        {!showForgot ? (
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="font-ticket text-sm text-ink-soft underline decoration-paper-line decoration-2 underline-offset-4 hover:text-stamp-dark"
          >
            Esqueci minha senha
          </button>
        ) : forgotState.status === "sent" ? (
          <p className="font-ticket text-sm text-stamp-dark">
            Se esse email tiver cadastro, o link de recuperação já foi enviado.
          </p>
        ) : (
          <form action={forgotAction} className="flex flex-col gap-3 text-left">
            <TicketField id="forgot-email" name="email" type="email" label="Email pra recuperação" required />
            {forgotState.error ? <ErrataNote>{forgotState.error}</ErrataNote> : null}
            <button
              type="submit"
              className="font-ticket text-sm font-bold uppercase tracking-[0.14em] text-stamp-dark underline decoration-2 underline-offset-4"
            >
              Enviar link de recuperação
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
