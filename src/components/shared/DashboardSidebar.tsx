"use client";

import {
  ClipboardList,
  LayoutDashboard,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { PRODUCT, ROUTES } from "@/lib/constants";

const NAV_ITEMS: readonly {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: ROUTES.DASHBOARD, label: "Overview", Icon: LayoutDashboard },
  { href: ROUTES.DASHBOARD_STORES, label: "Stores", Icon: Store },
  { href: ROUTES.DASHBOARD_ORDERS, label: "Orders", Icon: ClipboardList },
  { href: ROUTES.DASHBOARD_PROFILE, label: "Profile", Icon: UserRound },
];

function sidebarItemActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD) {
    return pathname === ROUTES.DASHBOARD || pathname === `${ROUTES.DASHBOARD}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function activeHrefForPath(pathname: string): string | null {
  let best: string | null = null;
  for (const { href } of NAV_ITEMS) {
    if (sidebarItemActive(pathname, href)) {
      if (!best || href.length > best.length) {
        best = href;
      }
    }
  }
  return best;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const current = activeHrefForPath(pathname);

  return (
    <aside
      className={cn(
        "shrink-0 border-border bg-background",
        "border-b sm:w-56 sm:border-b-0 sm:border-r",
      )}
      aria-label="Dashboard navigation"
    >
      <div className="px-3 py-3 sm:py-4">
        <p className="mb-2 hidden px-2 text-xs font-semibold uppercase tracking-wider text-muted sm:block">
          {PRODUCT.NAME}
        </p>
        <nav className="flex flex-row gap-1 overflow-x-auto pb-1 sm:flex-col sm:gap-0.5 sm:overflow-visible sm:pb-0">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = href === current;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-subtle text-foreground"
                    : "text-muted hover:bg-surface-subtle hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
