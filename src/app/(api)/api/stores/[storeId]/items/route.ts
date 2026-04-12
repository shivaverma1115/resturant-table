import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { createStoreItemForOwner } from "@/server/api/store/create-store-item-for-owner";
import { listStoreItemsForOwner } from "@/server/api/store/list-store-items-for-owner";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const { storeId } = await context.params;
    const result = await listStoreItemsForOwner(session.uid, storeId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ items: result.items });
  } catch (err: unknown) {
    logError(err, { context: "GET /api/stores/[storeId]/items" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const { storeId } = await context.params;
    const body: unknown = await request.json().catch(() => null);

    const result = await createStoreItemForOwner(session.uid, storeId, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ item: result.item }, { status: 201 });
  } catch (err: unknown) {
    logError(err, { context: "POST /api/stores/[storeId]/items" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
