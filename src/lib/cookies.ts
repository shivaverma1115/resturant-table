/**
 * Auth cookies — single place for cookie helpers.
 *
 * **Server (source of truth)**  
 * The signed-in user is represented by an **httpOnly** session JWT (`AUTH_COOKIE.SESSION_NAME`).
 * Only the server sets or reads the raw value (API routes, Server Components via `cookies()`).
 * Never store secrets in client-readable cookies.
 *
 * **Client (UI + Firebase SDK)**  
 * Use `useAuthUser()` from `@/components/providers/AuthProvider` everywhere you need auth state:
 * - `httpSession` — result of `/api/auth/me` (cookie accepted?); use for “signed in” UI.
 * - `user` — Firebase client `User` when the web SDK is signed in (optional; not the cookie itself).
 * - `refreshHttpSession` / `clearHttpSession` — keep client state in sync after login/logout.
 *
 * **Middleware**  
 * Use `hasAuthSessionCookie` for a cheap “cookie present?” check; APIs must still verify the JWT.
 */

import type { NextRequest } from "next/server";

import { AUTH_COOKIE } from "@/lib/constants";

export { AUTH_COOKIE };

/** True if the auth session cookie is present (middleware / edge). Does not verify the JWT. */
export function hasAuthSessionCookie(request: NextRequest): boolean {
  const v = request.cookies.get(AUTH_COOKIE.SESSION_NAME)?.value;
  return Boolean(v?.trim());
}

/** Options applied whenever the dashboard Firebase session cookie is set. */
export function authSessionCookieWriteOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/" as const,
    maxAge: maxAgeSeconds,
  };
}

/** Read — current session JWT (if any). App Router `cookies()` store. */
export function getAuthSessionCookie(store: {
  get: (name: string) => { value?: string } | undefined;
}): string | undefined {
  return store.get(AUTH_COOKIE.SESSION_NAME)?.value;
}

/** Create / update — after successful Firebase session exchange. */
export function setAuthSessionCookie(
  store: {
    set: (
      name: string,
      value: string,
      options: ReturnType<typeof authSessionCookieWriteOptions>,
    ) => void;
  },
  sessionCookieValue: string,
  maxAgeSeconds: number,
): void {
  store.set(
    AUTH_COOKIE.SESSION_NAME,
    sessionCookieValue,
    authSessionCookieWriteOptions(maxAgeSeconds),
  );
}

/** Delete — sign-out and similar (App Router `cookies()` store). */
export function deleteAuthSessionCookie(store: {
  delete: (name: string) => void;
}): void {
  store.delete(AUTH_COOKIE.SESSION_NAME);
}
