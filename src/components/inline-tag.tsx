/** Selo inline reutilizável — mesma gramática do CornerTag (papel grampeado), pra repetir em linhas de lista. */
export function InlineTag({ tone = "ink", children }: { tone?: "ink" | "stamp"; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block shrink-0 border border-dashed px-2 py-0.5 font-ticket text-[10px] font-bold uppercase tracking-[0.14em] ${
        tone === "stamp" ? "border-stamp text-stamp-dark" : "border-paper-line text-ink-faint"
      }`}
    >
      {children}
    </span>
  );
}
