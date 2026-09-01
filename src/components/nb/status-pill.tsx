import { STATUS_LABEL } from "@/lib/iphones";

const CORES: Record<string, string> = {
  avaliando: "var(--nb-ink-secondary)",
  comprado: "var(--nb-caixa)",
  preparacao: "var(--nb-lucro)",
  a_venda: "var(--nb-vendidos)",
  vendido: "var(--nb-estoque)",
};

export function NBStatusPill({ status }: { status: string }) {
  const cor = CORES[status] ?? "var(--nb-ink-secondary)";
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold"
      style={{
        backgroundColor: `color-mix(in srgb, ${cor} 14%, transparent)`,
        border: `1px solid color-mix(in srgb, ${cor} 30%, transparent)`,
        color: cor,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cor }} aria-hidden="true" />
      {STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? status}
    </span>
  );
}
