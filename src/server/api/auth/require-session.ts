import "server-only";

import { cookies } from "next/headers";

import { getAuthSessionCookie } from "@/lib/cookies/auth-session-cookie";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export type RequireSessionResult =
  | { ok: true; uid: string }
  | { ok: false; status: 401; message: string };

export async function requireSessionUid(): Promise<RequireSessionResult> {
  try {
    if (!isFirebaseAdminConfigured()) {
      return { ok: false, status: 401, message: "Not authenticated." };
    }
    const cookieStore = await cookies();
    const session = getAuthSessionCookie(cookieStore);
    if (!session?.trim()) {
      return { ok: false, status: 401, message: "Not authenticated." };
    }
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);
    return { ok: true, uid: decoded.uid };
  } catch (err: any) {
    return { ok: false, status: 401, message: err.message.trim() || "Not authenticated." };
  }
}
