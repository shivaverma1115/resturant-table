import { NextResponse } from "next/server";

import { requireSessionUid } from "@/server/api/auth/require-session";
import { getProfileForUid } from "@/server/api/profile/get-profile";
import { patchProfileForUid } from "@/server/api/profile/patch-profile";
import { logError } from "@/lib/utils/logError";

export async function GET() {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json({ error: session.message }, { status: session.status });
    }
    const profile = await getProfileForUid(session.uid);
    return NextResponse.json(profile);
  } catch (err: any) {
    logError(err, {
      context: "GET /api/profile",
    });
    return NextResponse.json({ error: err.message.trim() }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json({ error: session.message }, { status: session.status });
    }

    const body = await request.json().catch(() => null);

    const result = await patchProfileForUid(session.uid, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }

    return NextResponse.json(result.profile);
  } catch (err: any) {
    logError(err, {
      context: "PATCH /api/profile",
    });
    return NextResponse.json({ error: err.message.trim() }, { status: 500 });

  }
}
