import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/utils/logError";
import { signupWithSession } from "@/server/api/auth/signup";
import { setAuthSessionCookie } from "@/lib/cookies/auth-session-cookie";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const result = await signupWithSession(body);
    
    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status },
      );
    }

    const cookieStore = await cookies();
    setAuthSessionCookie(
      cookieStore,
      result.sessionCookie,
      result.maxAgeSeconds,
    );

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    logError(error, {
      context: "Signup API",
      meta: { url: "/api/auth/signup", method: "POST" },
    });
    return NextResponse.json(
      { message: error.message ?? ERROR_MESSAGE_GENERIC },
      { status: 500 },
    );
  }
}
