type TornEdgeProps = {
  className?: string;
  flip?: boolean;
};

/** Borda rasgada de talão — canto de ticket arrancado do bloco. */
export function TornEdge({ className, flip = false }: TornEdgeProps) {
  return (
    <svg
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      className={className}
      style={{
        ...(flip ? { transform: "scaleY(-1)" } : undefined),
        filter: "drop-shadow(0 2px 2px rgb(34 32 28 / 22%))",
      }}
      aria-hidden="true"
    >
      <path
        d="M0,0 L0,6 L8,2 L16,9 L24,3 L32,10 L40,2 L48,8 L56,1 L64,9 L72,4 L80,11 L88,2 L96,7 L104,1 L112,10 L120,3 L128,9 L136,2 L144,8 L152,1 L160,9 L168,4 L176,11 L184,2 L192,7 L200,1 L208,10 L216,3 L224,9 L232,2 L240,6 L240,0 Z"
        fill="var(--paper)"
      />
    </svg>
  );
}
