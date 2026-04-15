"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  MAIN_HEADER_NAV_LINKS,
  PRODUCT,
  ROUTES,
} from "@/lib/constants";
import { getFirebaseClientAuth } from "@/lib/firebase-client";

import { useAuthUser } from "./AuthProvider";
import { ThemeToggle } from "./ThemeToggle";

function headerActiveHref(
  pathname: string,
): (typeof MAIN_HEADER_NAV_LINKS)[number]["href"] | null {
  let best: (typeof MAIN_HEADER_NAV_LINKS)[number]["href"] | null = null;
  for (const { href } of MAIN_HEADER_NAV_LINKS) {
    const isHome = href === ROUTES.HOME;
    const match = isHome
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
    if (match && (!best || href.length > best.length)) {
      best = href;
    }
  }
  return best;
}

type SiteHeaderProps = Readonly<{
  firebaseWebReady: boolean;
}>;

export function SiteHeader({ firebaseWebReady }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    httpSession,
    clearHttpSession,
  } = useAuthUser();
  const [signingOut, setSigningOut] = useState(false);

  const authPending =
    (firebaseWebReady && authLoading) || httpSession === null;
  const signedIn = !authPending && (user !== null || httpSession === true);

  const activeHref = headerActiveHref(pathname);

  // Public store pages have their own scoped header/footer layout.
  if (pathname.startsWith("/store/")) {
    return null;
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      if (firebaseWebReady) {
        try {
          await signOut(getFirebaseClientAuth());
        } catch {
          /* ignore */
        }
      }
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      clearHttpSession();
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border",
        "bg-background/95 supports-[backdrop-filter]:backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-4">
        <Link
          href={ROUTES.HOME}
          className="shrink-0 text-base font-semibold tracking-tight text-foreground hover:text-accent"
        >
          {PRODUCT.NAME}
        </Link>

        <nav
          className="flex min-w-0 flex-1 justify-center overflow-x-auto"
          aria-label="Main"
        >
          <ul className="flex items-center gap-1 sm:gap-4">
            {MAIN_HEADER_NAV_LINKS.map(({ href, label }) => {
              const active = href === activeHref;
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:px-3",
                      active
                        ? "bg-surface-subtle text-foreground"
                        : "text-muted hover:bg-surface-subtle hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {authPending ? (
            <span
              className="inline-block h-9 w-20 rounded-lg border border-border bg-surface-subtle"
              aria-hidden
            />
          ) : signedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href={ROUTES.SIGNUP}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
