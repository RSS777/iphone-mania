import { InlineTag } from "./inline-tag";

const STATUS_LABEL: Record<string, string> = {
  avaliando: "Avaliando",
  comprado: "Comprado",
  preparacao: "Preparação",
  a_venda: "À venda",
  vendido: "Vendido",
};

export function StatusTag({ status }: { status: string }) {
  return (
    <InlineTag tone={status === "vendido" ? "stamp" : "ink"}>
      {STATUS_LABEL[status] ?? status}
    </InlineTag>
  );
}
