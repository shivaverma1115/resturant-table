import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { createStoreItemForOwner, CreateStoreItemForOwnerResult } from "@/server/api/store/create-store-item-for-owner";
import { listStoreItemsForOwner, ListStoreItemsForOwnerResult } from "@/server/api/store/list-store-items-for-owner";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId } = await context.params;
    const result: ListStoreItemsForOwnerResult = await listStoreItemsForOwner(session.uid, storeId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ items: result.items });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId] Items API",
      meta: { url: "/api/stores/[storeId]/items", method: "GET" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result: CreateStoreItemForOwnerResult = await createStoreItemForOwner(session.uid, storeId, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ item: result.item }, { status: 201 });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/items API",
      meta: { url: "/api/stores/[storeId]/items", method: "POST" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
