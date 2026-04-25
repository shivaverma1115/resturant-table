import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSessionFromIdToken, CreateSessionResult } from "@/server/api/auth/create-session";
import { setAuthSessionCookie } from "@/lib/cookies";
import { logError } from "@/lib/utils/logError";
import { errorMessage } from "@/lib/helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const idToken = body.idToken as string | undefined;
    if (!idToken) return NextResponse.json({ error: "Invalid idToken." }, { status: 400 });

    const result: CreateSessionResult = await createSessionFromIdToken(idToken);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

    const cookieStore = await cookies();
    setAuthSessionCookie(cookieStore, result.sessionCookie, result.maxAgeSeconds);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    logError(err,
      {
        context: "Auth Session API",
        meta: { url: "/api/auth/session", method: "POST" },
      }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });

  }
}
