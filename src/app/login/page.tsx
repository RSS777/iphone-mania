import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main
      className="font-nb flex min-h-screen flex-col items-center justify-center bg-[var(--nb-bg)] px-6 py-12"
      style={{ "--tint": "var(--nb-estoque)" } as React.CSSProperties}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-[20px] text-[24px] font-extrabold [font-family:var(--font-display)]"
            style={{
              background: "linear-gradient(135deg, var(--nb-estoque), #23c9c9)",
              color: "var(--nb-accent-ink)",
              boxShadow: "0 12px 28px -10px color-mix(in srgb, var(--nb-estoque) 55%, transparent)",
            }}
            aria-hidden="true"
          >
            iM
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--nb-ink)] [font-family:var(--font-display)]">
            iPhone Mania
          </h1>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
