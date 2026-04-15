"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { PRODUCT } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { StorePrimaryNavLink } from "@/features/public-store/lib/public-store-paths";
import { usePublicStoreSession } from "@/features/public-store/state/PublicStoreSessionProvider";

type StorePublicNavbarProps = Readonly<{
  storeSlug: string;
  primaryLinks: StorePrimaryNavLink[];
  orderHref: string;
}>;

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StorePublicNavbar({
  storeSlug,
  primaryLinks,
  orderHref,
}: StorePublicNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItemCount, testModeEnabled, toggleTestMode } = usePublicStoreSession();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="hidden border-b border-zinc-800/90 md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs text-zinc-400 sm:px-6">
          <p>OPENING HOURS: 08:00 AM - 09:00 PM</p>
          <p>LOCATION: 55 MAIN STREET, NEW YORK</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href={primaryLinks[0]?.href ?? "/"} className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-amber-500/60 text-amber-400">
            T
          </span>
          <span className="text-base font-semibold tracking-tight">{PRODUCT.NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                )}
              >
                {link.label}
                {link.key === "cart" && cartItemCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-950">
                    {cartItemCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className={cn(
              "inline-flex items-center rounded-md border px-3 py-2 text-xs font-medium transition-colors",
              testModeEnabled
                ? "border-amber-400/70 bg-amber-500/15 text-amber-200"
                : "border-zinc-700 text-zinc-200 hover:bg-zinc-800",
            )}
            onClick={toggleTestMode}
          >
            {testModeEnabled ? "Test mode: ON" : "Test mode: OFF"}
          </button>
          <Link
            href={orderHref}
            className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Book a table
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-100 hover:bg-zinc-800 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-dvh w-[82%] max-w-sm border-l border-zinc-800 bg-zinc-950 p-5 shadow-2xl transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Store</p>
            <p className="font-semibold text-zinc-100">{storeSlug}</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-zinc-700 p-2 text-zinc-100 hover:bg-zinc-800"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {primaryLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                )}
              >
                {link.label}
                {link.key === "cart" && cartItemCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-950">
                    {cartItemCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-zinc-800 pt-5">
          <button
            type="button"
            className={cn(
              "mb-2 inline-flex w-full items-center justify-center rounded-md border px-3 py-2 text-xs font-medium transition-colors",
              testModeEnabled
                ? "border-amber-400/70 bg-amber-500/15 text-amber-200"
                : "border-zinc-700 text-zinc-200 hover:bg-zinc-800",
            )}
            onClick={toggleTestMode}
          >
            {testModeEnabled ? "Test mode: ON" : "Test mode: OFF"}
          </button>
          <Link
            href={orderHref}
            className="inline-flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400"
          >
            Book a table
          </Link>
        </div>
      </aside>
    </header>
  );
}
