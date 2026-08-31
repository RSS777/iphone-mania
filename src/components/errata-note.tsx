type ErrataNoteProps = {
  children: React.ReactNode;
};

/** Nota de correção estilo "errata" carimbada, pra erros do formulário. */
export function ErrataNote({ children }: ErrataNoteProps) {
  return (
    <div
      role="alert"
      className="-rotate-1 border-2 border-dashed border-errata bg-errata-soft px-4 py-3 font-ticket text-sm text-errata"
    >
      <span className="font-bold uppercase tracking-[0.14em]">Errata — </span>
      {children}
    </div>
  );
}
