import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { createStoreForOwner } from "@/server/api/store/create-store-for-owner";
import { listStoresForOwner } from "@/server/api/store/list-stores-for-owner";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

export async function GET(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    const limit =
      limitRaw === null || limitRaw === ""
        ? undefined
        : Number.parseInt(limitRaw, 10);
    const cursor = searchParams.get("cursor");

    const result = await listStoresForOwner(
      session.uid,
      cursor?.trim() ? cursor.trim() : null,
      limit,
    );
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({
      stores: result.stores,
      nextCursor: result.nextCursor,
    });
  } catch (err: unknown) {
    logError(err, { context: "GET /api/stores" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
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

    const result = await createStoreForOwner(session.uid, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ store: result.store }, { status: 201 });
  } catch (err: unknown) {
    logError(err, { context: "POST /api/stores" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
