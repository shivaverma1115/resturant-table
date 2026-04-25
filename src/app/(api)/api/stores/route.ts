import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { createStoreForOwner, CreateStoreForOwnerResult } from "@/server/api/store/create-store-for-owner";
import { listStoresForOwner, ListStoresForOwnerResult } from "@/server/api/store/list-stores-for-owner";
import { errorMessage } from "@/lib/helpers";

export async function GET(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    const cursor = searchParams.get("cursor");
    const limit = limitRaw === null || limitRaw === "" ? undefined : Number.parseInt(limitRaw, 10);

    const result: ListStoresForOwnerResult = await listStoresForOwner(
      session.uid,
      cursor?.trim() ? cursor.trim() : null,
      limit,
    );
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({
      stores: result.stores,
      nextCursor: result.nextCursor,
    });
  } catch (err: unknown) {
    logError(err,
      {
        context: "Stores API",
        meta: { url: "/api/stores", method: "GET" },
      }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const body = await request.json().catch(() => ({}));

    const result: CreateStoreForOwnerResult = await createStoreForOwner(session.uid, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ store: result.store }, { status: 201 });
  } catch (err: unknown) {
    logError(err,
      {
        context: "Stores API",
        meta: { url: "/api/stores", method: "POST" },
      }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
