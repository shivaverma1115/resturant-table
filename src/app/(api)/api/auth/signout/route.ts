import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteAuthSessionCookie } from "@/lib/cookies";
import { logError } from "@/lib/utils/logError";
import { errorMessage } from "@/lib/helpers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    deleteAuthSessionCookie(cookieStore);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logError(error,
      {
        context: "Auth Signout API",
        meta: { url: "/api/auth/signout", method: "POST" },
      }
    );
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
