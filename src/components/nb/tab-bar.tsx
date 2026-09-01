"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { EstoqueIcon, GarimpoIcon, CaixaIcon, VendidosIcon, LucroIcon, MetasIcon } from "../icons";

type Tab = {
  href: string;
  label: string;
  Icon: ComponentType<{ active?: boolean; className?: string; style?: React.CSSProperties }>;
  tint: string;
};

const TABS: Tab[] = [
  { href: "/estoque", label: "Estoque", Icon: EstoqueIcon, tint: "var(--nb-estoque)" },
  { href: "/garimpo", label: "Garimpo", Icon: GarimpoIcon, tint: "var(--nb-garimpo)" },
  { href: "/caixa", label: "Caixa", Icon: CaixaIcon, tint: "var(--nb-caixa)" },
  { href: "/vendidos", label: "Vendidos", Icon: VendidosIcon, tint: "var(--nb-vendidos)" },
  { href: "/lucro", label: "Lucro", Icon: LucroIcon, tint: "var(--nb-lucro)" },
  { href: "/metas", label: "Metas", Icon: MetasIcon, tint: "var(--nb-metas)" },
];

/** Barra de abas fixa embaixo, ícone-primeiro (sem rótulo) — like Instagram. */
export function NBTabBar() {
  const pathname = usePathname();

  return (
    <nav className="nb-tabbar-blur nb-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--nb-separator)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2.5">
        {TABS.map(({ href, label, Icon, tint }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center py-1 active:opacity-60"
            >
              <Icon active={active} className="h-7 w-7" style={{ color: active ? tint : "var(--nb-ink-tertiary)" }} />
              <span
                className="mt-0.5 h-1 w-1 rounded-full"
                style={{ backgroundColor: active ? tint : "transparent" }}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
