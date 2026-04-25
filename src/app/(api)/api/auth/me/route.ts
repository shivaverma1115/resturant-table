import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAuthSessionCookie } from "@/lib/cookies";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { logError } from "@/lib/utils/logError";

export async function GET() {
  try {
    if (!isFirebaseAdminConfigured()) return NextResponse.json({ authenticated: false }, { status: 401 });

    const cookieStore = await cookies();
    const session = getAuthSessionCookie(cookieStore);
    if (!session?.trim()) return NextResponse.json({ authenticated: false }, { status: 401 });

    const auth: Auth = getFirebaseAdminAuth();
    const decoded: DecodedIdToken = await auth.verifySessionCookie(session, true);
    
    return NextResponse.json({ authenticated: true, uid: decoded.uid });
  } catch (err: unknown) {
    logError(err,
      {
        context: "Auth Me API",
        meta: { url: "/api/auth/me", method: "GET" },
      }
    );
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
