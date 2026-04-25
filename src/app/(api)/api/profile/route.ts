import { NextResponse } from "next/server";

import { requireSessionUid } from "@/server/api/auth/require-session";
import { getProfileForUid } from "@/server/api/profile/get-profile";
import { patchProfileForUid, PatchProfileResult } from "@/server/api/profile/patch-profile";
import { logError } from "@/lib/utils/logError";
import { errorMessage } from "@/lib/helpers";
import { ProfileResponse } from "@/lib/profile-types";

export async function GET() {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const profile: ProfileResponse = await getProfileForUid(session.uid);
    return NextResponse.json(profile);
  } catch (err: unknown) {
    logError(err,
      {
        context: "Profile API",
        meta: { url: "/api/profile", method: "GET" },
      }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const body = await request.json().catch(() => null);

    const result: PatchProfileResult = await patchProfileForUid(session.uid, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json(result.profile);
  } catch (err) {
    logError(err,
      {
        context: "Profile API",
        meta: { url: "/api/profile", method: "PATCH" },
      }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
