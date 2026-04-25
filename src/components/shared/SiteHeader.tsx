"use client";

import { signOut } from "firebase/auth";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import {
  MAIN_HEADER_NAV_LINKS,
  PRODUCT,
  ROUTES,
} from "@/lib/constants";
import { getFirebaseClientAuth } from "@/lib/firebase-client";

import { useAuthUser } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    httpSession,
    firebaseWebReady,
    clearHttpSession,
  } = useAuthUser();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

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
      if (firebaseWebReady) await signOut(getFirebaseClientAuth());
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
          className="hidden min-w-0 flex-1 justify-center md:flex"
          aria-label="Main"
        >
          <MainNavLinks
            activeHref={activeHref}
            listClassName="flex items-center gap-1 sm:gap-4"
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
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
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent
          className={cn(
            "left-auto right-0 top-0 flex h-[100dvh] max-h-none w-[min(100vw-1rem,20rem)] translate-x-0 translate-y-0 flex-col gap-0 rounded-none rounded-l-xl border-y-0 border-r-0 p-0 sm:max-w-none",
          )}
        >
          <div className="border-b border-border px-4 py-3 pr-12">
            <DialogTitle className="text-base font-semibold">Menu</DialogTitle>
            <DialogDescription className="sr-only">
              Main site navigation.
            </DialogDescription>
          </div>
          <nav
            id="mobile-main-nav"
            className="flex-1 overflow-y-auto px-2 py-3"
            aria-label="Main"
          >
            <MainNavLinks
              activeHref={activeHref}
              onNavigate={() => setMobileNavOpen(false)}
              listClassName="flex flex-col gap-1"
            />
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  );
}


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

function MainNavLinks({
  activeHref,
  onNavigate,
  listClassName,
}: Readonly<{
  activeHref: ReturnType<typeof headerActiveHref>;
  onNavigate?: () => void;
  listClassName: string;
}>) {
  return (
    <ul className={listClassName}>
      {MAIN_HEADER_NAV_LINKS.map(({ href, label }) => {
        const active = href === activeHref;
        return (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                "block rounded-md px-2 py-2.5 text-sm font-medium transition-colors sm:px-3 md:py-1.5",
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
  );
}