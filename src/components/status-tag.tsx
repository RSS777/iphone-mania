const STATUS_LABEL: Record<string, string> = {
  avaliando: "Avaliando",
  comprado: "Comprado",
  preparacao: "Preparação",
  a_venda: "À venda",
  vendido: "Vendido",
};

/** Selo de status inline — mesma gramática do CornerTag (papel grampeado), sem rotação/absoluto, pra repetir em linhas de lista. */
export function StatusTag({ status }: { status: string }) {
  const tone = status === "vendido" ? "stamp" : "ink";

  return (
    <span
      className={`inline-block shrink-0 border border-dashed px-2 py-0.5 font-ticket text-[10px] font-bold uppercase tracking-[0.14em] ${
        tone === "stamp" ? "border-stamp text-stamp-dark" : "border-paper-line text-ink-faint"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
