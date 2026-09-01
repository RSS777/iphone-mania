export function NBErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border px-3.5 py-3 text-[14px]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--nb-danger) 12%, transparent)",
        borderColor: "color-mix(in srgb, var(--nb-danger) 30%, transparent)",
        color: "var(--nb-danger)",
      }}
    >
      {children}
    </div>
  );
}
