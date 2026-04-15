"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import {
  storeCartPath,
  storeItemDetailsPath,
  storeItemsPath,
  storeOrderSuccessPath,
} from "@/features/public-store/lib/public-store-paths";
import { usePublicStoreSession } from "@/features/public-store/state/PublicStoreSessionProvider";

function isRouteCovered(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StoreTestModeBanner() {
  const pathname = usePathname();
  const { storeSlug, testModeEnabled } = usePublicStoreSession();

  if (!testModeEnabled) return null;

  const steps = [
    { href: storeItemsPath(storeSlug), label: "1. Browse items" },
    { href: storeItemDetailsPath(storeSlug, "espresso-classic"), label: "2. Open details" },
    { href: storeCartPath(storeSlug), label: "3. Review cart" },
    { href: storeOrderSuccessPath(storeSlug), label: "4. Place demo order" },
  ] as const;

  return (
    <section className="border-b border-amber-400/30 bg-amber-500/10">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-2.5 text-xs sm:px-6">
        <span className="rounded-full border border-amber-300/60 px-2 py-0.5 font-semibold text-amber-300">
          TEST MODE
        </span>
        <span className="text-zinc-300">Use this flow to verify public-store UI:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {steps.map((step) => {
            const active = isRouteCovered(pathname, step.href);
            return (
              <Link
                key={step.href}
                href={step.href}
                className={cn(
                  "rounded-md px-2 py-1 transition-colors",
                  active
                    ? "bg-amber-400/20 text-amber-200"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                {step.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
