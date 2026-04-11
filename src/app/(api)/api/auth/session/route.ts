import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSessionFromIdToken } from "@/server/api/auth/create-session";
import { setAuthSessionCookie } from "@/lib/cookies/auth-session-cookie";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const idToken =
    typeof body === "object" &&
    body !== null &&
    "idToken" in body &&
    typeof (body as { idToken?: unknown }).idToken === "string"
      ? (body as { idToken: string }).idToken
      : undefined;

  const result = await createSessionFromIdToken(idToken);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const cookieStore = await cookies();
  setAuthSessionCookie(
    cookieStore,
    result.sessionCookie,
    result.maxAgeSeconds,
  );

  return NextResponse.json({ ok: true });
}
