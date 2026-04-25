import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAuthSessionCookie } from "@/lib/cookies";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase-admin";

export async function GET() {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const cookieStore = await cookies();
  const session = getAuthSessionCookie(cookieStore);
  if (!session?.trim()) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);
    return NextResponse.json({ authenticated: true, uid: decoded.uid });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
