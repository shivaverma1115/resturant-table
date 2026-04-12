"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";

const ITEMS = [
  { href: ROUTES.DASHBOARD_STORES, label: "My stores" },
  { href: ROUTES.DASHBOARD_STORE_SETTINGS, label: "Store settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === ROUTES.DASHBOARD_STORES) {
    const base =
      pathname === ROUTES.DASHBOARD_STORES ||
      pathname === `${ROUTES.DASHBOARD_STORES}/`;
    if (!base) return false;
    // Per-store settings, preview, or edit are not the list tab.
    return !/\/stores\/[^/]+\/(settings|preview|edit|items|qr|orders)/.test(
      pathname,
    );
  }
  if (href === ROUTES.DASHBOARD_STORE_SETTINGS) {
    return (
      pathname === ROUTES.DASHBOARD_STORE_SETTINGS ||
      pathname === `${ROUTES.DASHBOARD_STORE_SETTINGS}/` ||
      /\/stores\/[^/]+\/settings/.test(pathname) ||
      /\/stores\/[^/]+\/edit/.test(pathname) ||
      /\/stores\/[^/]+\/(items|qr|orders)/.test(pathname)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StoresSubnav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex flex-wrap gap-1 border-b border-border pb-px"
      aria-label="Store section"
    >
      {ITEMS.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "-mb-px rounded-t-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-border border-b-background bg-background text-foreground"
                : "text-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
