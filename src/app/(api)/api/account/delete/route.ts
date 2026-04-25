import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ACCOUNT_DELETE_CONFIRM_PHRASE } from "@/lib/constants";
import { deleteAuthSessionCookie } from "@/lib/cookies";
import { logError } from "@/lib/utils/logError";
import { deleteUserAccount } from "@/server/api/account/delete-user-account";
import { requireSessionUid } from "@/server/api/auth/require-session";

const bodySchema = z
  .object({
    confirmPhrase: z.literal(ACCOUNT_DELETE_CONFIRM_PHRASE),
  })
  .strict();

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

export async function POST(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const body: unknown = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: `Type the exact phrase ${ACCOUNT_DELETE_CONFIRM_PHRASE} to confirm account deletion.`,
        },
        { status: 400 },
      );
    }

    const result = await deleteUserAccount(session.uid);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    const cookieStore = await cookies();
    deleteAuthSessionCookie(cookieStore);

    return NextResponse.json({
      ok: true as const,
      deletedStoreCount: result.deletedStoreCount,
    });
  } catch (err: unknown) {
    logError(err, { context: "POST /api/account/delete" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
