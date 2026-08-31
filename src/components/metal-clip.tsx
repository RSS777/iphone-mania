/** Clipe de metal prendendo o talão na prancheta — único elemento realmente metálico do mundo visual. */
export function MetalClip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 34"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clip-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0f1" />
          <stop offset="38%" stopColor="#9aa1a6" />
          <stop offset="55%" stopColor="#c7cbce" />
          <stop offset="100%" stopColor="#6c7378" />
        </linearGradient>
      </defs>
      <rect x="10" y="0" width="36" height="10" rx="2" fill="url(#clip-metal)" />
      <path
        d="M6 8 h44 a4 4 0 0 1 4 4 v6 a4 4 0 0 1 -4 4 h-6 l-4 8 l-4 -8 h-22 l-4 8 l-4 -8 h-0 a4 4 0 0 1 -4 -4 v-6 a4 4 0 0 1 4 -4 z"
        fill="url(#clip-metal)"
        stroke="#5b6266"
        strokeWidth="0.5"
      />
      <rect x="14" y="12" width="28" height="2.2" rx="1.1" fill="#4d5357" opacity="0.55" />
    </svg>
  );
}
