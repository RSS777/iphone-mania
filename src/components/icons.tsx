type IconProps = { active?: boolean; className?: string; style?: React.CSSProperties };

const base = "shrink-0";

export function EstoqueIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M12 2.4 3 6.6v10.8L12 21.6l9-4.2V6.6L12 2.4Zm0 2.24 6.24 2.91-6.24 2.91-6.24-2.91L12 4.64ZM4.5 8.36l6.75 3.15v7.63L4.5 16v-7.64Zm15 7.64-6.75 3.14v-7.63L19.5 8.36V16Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <path d="M12 3 4 6.8v10.4L12 21l8-3.8V6.8L12 3Z" />
      <path d="M4 6.8 12 10.6l8-3.8" />
      <path d="M12 10.6V21" />
    </svg>
  );
}

export function CaixaIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm9 2.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5ZM6 8a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Zm12 6a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0v-1a1 1 0 0 0-1-1Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <circle cx="12" cy="12" r="2.75" />
      <path d="M6 9v0M18 15v0" />
    </svg>
  );
}

export function VendidosIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M20.59 12.59 12 21.17a2 2 0 0 1-2.83 0l-6.34-6.34a2 2 0 0 1 0-2.83L11.41 3.4A2 2 0 0 1 12.83 2.8H19A2 2 0 0 1 21 4.8v6.17a2 2 0 0 1-.59 1.42ZM16 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <path d="m20 12.6-8.3 8.3a1.5 1.5 0 0 1-2.12 0l-6.48-6.48a1.5 1.5 0 0 1 0-2.12L11.4 3.9a1.5 1.5 0 0 1 1.06-.44H18.5A1.5 1.5 0 0 1 20 5v6.1a1.5 1.5 0 0 1-.44 1.06Z" />
      <circle cx="16" cy="7.5" r="1.25" />
    </svg>
  );
}

export function LucroIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M3 19.5A1.5 1.5 0 0 1 4.5 18H5v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V18h1v-8.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V18h1V6.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V18h.5a1.5 1.5 0 0 1 0 3H4.5A1.5 1.5 0 0 1 3 19.5Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <path d="M4 20V12M9.5 20V8M15 20v-6M20 20V5" />
      <path d="M16.5 6 21 4.8 21.9 9" />
      <path d="M4 20h17" />
    </svg>
  );
}

export function MetasIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M12 2a10 10 0 1 0 10 10 1 1 0 0 0-2 0 8 8 0 1 1-8-8 1 1 0 0 0 0-2Z" />
      <path d="M12 6a6 6 0 1 0 6 6 1 1 0 0 0-2 0 4 4 0 1 1-4-4 1 1 0 0 0 0-2Z" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GarimpoIcon({ active, className = "", style }: IconProps) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} style={style}>
      <path d="M11 3a8 8 0 1 0 4.9 14.32l4.39 4.38a1 1 0 0 0 1.42-1.41l-4.39-4.39A8 8 0 0 0 11 3Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
      <path d="M11 7a1 1 0 0 0-1 1v2H8a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V8a1 1 0 0 0-1-1Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.6-4.6" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`} style={style}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`${base} ${className}`} style={style}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
