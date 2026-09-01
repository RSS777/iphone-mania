/** Barra de progresso — retângulo pautado preenchido, sem cantos arredondados nem gradiente. */
export function ProgressBar({ pct }: { pct: number }) {
  const largura = Math.max(0, Math.min(100, pct));
  const estourou = pct > 100;

  return (
    <div className="h-6 w-full border-2 border-ink bg-paper">
      <div
        className={`h-full ${estourou ? "bg-stamp-dark" : "bg-stamp"}`}
        style={{ width: `${largura}%` }}
      />
    </div>
  );
}
