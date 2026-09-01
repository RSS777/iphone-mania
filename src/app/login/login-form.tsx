"use client";

import { useActionState, useState } from "react";
import { signIn, requestPasswordReset, type LoginState, type ForgotPasswordState } from "./actions";
import { NBTextRow } from "@/components/nb/text-row";
import { NBButton } from "@/components/nb/button";
import { NBErrorBanner } from "@/components/nb/error-banner";

const initialLoginState: LoginState = { error: null, email: "" };
const initialForgotState: ForgotPasswordState = { status: "idle", error: null };

export function LoginForm() {
  const [loginState, loginAction] = useActionState(signIn, initialLoginState);
  const [forgotState, forgotAction] = useActionState(requestPasswordReset, initialForgotState);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <form action={loginAction} noValidate className="flex flex-col gap-3">
        <NBTextRow
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="username"
          defaultValue={loginState.email}
          required
        />
        <NBTextRow
          id="password"
          name="password"
          type="password"
          label="Senha"
          autoComplete="current-password"
          required
        />

        {loginState.error ? <NBErrorBanner>{loginState.error}</NBErrorBanner> : null}

        <NBButton type="submit" pendingLabel="Entrando…" className="mt-1">
          Entrar
        </NBButton>
      </form>

      <div className="mt-5 text-center">
        {!showForgot ? (
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-[14px] font-semibold"
            style={{ color: "var(--nb-caixa)" }}
          >
            Esqueci minha senha
          </button>
        ) : forgotState.status === "sent" ? (
          <p className="text-[14px] text-[var(--nb-ink-secondary)]">
            Se esse email tiver cadastro, o link de recuperação já foi enviado.
          </p>
        ) : (
          <form action={forgotAction} noValidate className="flex flex-col gap-3 text-left">
            <NBTextRow id="forgot-email" name="email" type="email" label="Email pra recuperação" required />
            {forgotState.error ? <NBErrorBanner>{forgotState.error}</NBErrorBanner> : null}
            <NBButton type="submit" variant="tinted" pendingLabel="Enviando…">
              Enviar link de recuperação
            </NBButton>
          </form>
        )}
      </div>
    </div>
  );
}
