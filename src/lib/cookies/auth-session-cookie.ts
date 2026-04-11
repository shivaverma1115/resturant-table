import "server-only";

import { AUTH_COOKIE } from "@/lib/constants";

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

/** Read — current session JWT (if any). */
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
