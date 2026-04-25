import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/utils/logError";
import { signupWithSession, SignupWithSessionResult } from "@/server/api/auth/signup";
import { setAuthSessionCookie } from "@/lib/cookies";
import { errorMessage } from "@/lib/helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const result: SignupWithSessionResult = await signupWithSession(body);
    if (!result.ok) return NextResponse.json({ message: result.message }, { status: result.status });

    const cookieStore = await cookies();
    setAuthSessionCookie(cookieStore, result.sessionCookie, result.maxAgeSeconds);

    return NextResponse.json({ message: result.message });
  } catch (error) {
    logError(error, {
      context: "Signup API",
      meta: { url: "/api/auth/signup", method: "POST" },
    });
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
