import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteAuthSessionCookie } from "@/lib/cookies";

export async function POST() {
  const cookieStore = await cookies();
  deleteAuthSessionCookie(cookieStore);
  return NextResponse.json({ ok: true });
}
