import Link from "next/link";
import { ChevronRightIcon } from "../icons";

/** Pilha de cartões estilo neobank — cada NBRow é seu próprio cartão, com respiro entre eles. */
export function NBGroup({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      {children}
      {footer ? <p className="px-1 text-[13px] text-[var(--nb-ink-tertiary)]">{footer}</p> : null}
    </div>
  );
}

type NBRowProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

/** Cartão de linha navegável (com chevron) ou de exibição, estilo neobank. */
export function NBRow({ title, subtitle, trailing, href, onClick, icon }: NBRowProps) {
  const content = (
    <div className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-[var(--nb-separator)] bg-[var(--nb-surface)] px-4 py-3 active:opacity-80">
      {icon ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--nb-surface-2)] text-[var(--nb-estoque)]">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold text-[var(--nb-ink)]">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[12.5px] text-[var(--nb-ink-tertiary)] [font-variant-numeric:tabular-nums]">{subtitle}</p>
        ) : null}
      </div>
      {trailing ? <span className="shrink-0 text-[13px] text-[var(--nb-ink-secondary)]">{trailing}</span> : null}
      {href ? <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--nb-ink-tertiary)]" /> : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
