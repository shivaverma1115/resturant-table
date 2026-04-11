import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE, ROUTES } from "@/lib/constants";

function hasSessionCookie(request: NextRequest): boolean {
  const v = request.cookies.get(AUTH_COOKIE.SESSION_NAME)?.value;
  return Boolean(v?.trim());
}

function guestMayVisit(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/signup")) return true;
  if (pathname.startsWith("/store")) return true;
  if (pathname.startsWith("/login")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = hasSessionCookie(request);

  if (pathname.startsWith("/signup")) {
    if (loggedIn) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL(ROUTES.SIGNUP, request.url));
    }
    return NextResponse.next();
  }

  if (!loggedIn && !guestMayVisit(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml)$).*)",
  ],
};
