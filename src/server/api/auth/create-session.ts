import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export type CreateSessionResult =
  | { ok: true; sessionCookie: string; maxAgeSeconds: number }
  | { ok: false; error: string; status: number };

export async function createSessionFromIdToken(
  idToken: string | undefined,
): Promise<CreateSessionResult> {
  if (!isFirebaseAdminConfigured()) {
    return {
      ok: false,
      error: "Server session is not configured (Firebase Admin credentials).",
      status: 503,
    };
  }
  const token = typeof idToken === "string" ? idToken.trim() : "";
  if (!token) {
    return { ok: false, error: "Missing idToken", status: 400 };
  }
  try {
    const auth = getFirebaseAdminAuth();
    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn: FIVE_DAYS_MS,
    });
    return {
      ok: true,
      sessionCookie,
      maxAgeSeconds: Math.floor(FIVE_DAYS_MS / 1000),
    };
  } catch (err: unknown) {
    const detail =
      err instanceof Error && err.message.trim() ? err.message.trim() : "";
    return {
      ok: false,
      error:
        detail && process.env.NODE_ENV === "development"
          ? detail
          : "Invalid or expired token",
      status: 401,
    };
  }
}
