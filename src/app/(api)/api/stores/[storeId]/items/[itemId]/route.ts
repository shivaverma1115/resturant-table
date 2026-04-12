import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { deleteStoreItemForOwner } from "@/server/api/store/delete-store-item-for-owner";
import { patchStoreItemForOwner } from "@/server/api/store/patch-store-item-for-owner";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; itemId: string }>;
}>;

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const { storeId, itemId } = await context.params;
    const body: unknown = await request.json().catch(() => null);

    const result = await patchStoreItemForOwner(
      session.uid,
      storeId,
      itemId,
      body,
    );
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ item: result.item });
  } catch (err: unknown) {
    logError(err, { context: "PATCH /api/stores/[storeId]/items/[itemId]" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) {
      return NextResponse.json(
        { error: session.message },
        { status: session.status },
      );
    }

    const { storeId, itemId } = await context.params;
    const result = await deleteStoreItemForOwner(session.uid, storeId, itemId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ deleted: true as const });
  } catch (err: unknown) {
    logError(err, { context: "DELETE /api/stores/[storeId]/items/[itemId]" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
