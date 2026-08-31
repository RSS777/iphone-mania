type CornerTagProps = {
  children: React.ReactNode;
  tone?: "ink" | "stamp";
};

/** Etiqueta grampeada no canto do talão — nunca uma legenda empilhada sobre o título. */
export function CornerTag({ children, tone = "ink" }: CornerTagProps) {
  return (
    <span
      className={`absolute -top-3 right-5 rotate-3 border border-dashed px-2 py-1 font-ticket text-[10px] font-bold uppercase tracking-[0.16em] shadow-[0_1px_0_var(--paper-line)] ${
        tone === "stamp"
          ? "border-stamp bg-paper text-stamp-dark"
          : "border-paper-line bg-paper text-ink-faint"
      }`}
    >
      {children}
    </span>
  );
}
