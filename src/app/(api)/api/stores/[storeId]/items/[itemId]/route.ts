import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { deleteStoreItemForOwner, DeleteStoreItemForOwnerResult } from "@/server/api/store/delete-store-item-for-owner";
import { patchStoreItemForOwner, PatchStoreItemForOwnerResult } from "@/server/api/store/patch-store-item-for-owner";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; itemId: string }>;
}>;

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId, itemId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result: PatchStoreItemForOwnerResult = await patchStoreItemForOwner(
      session.uid,
      storeId,
      itemId,
      body,
    );
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ item: result.item });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/items/[itemId] API",
      meta: { url: "/api/stores/[storeId]/items/[itemId]", method: "PATCH" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId, itemId } = await context.params;
    const result: DeleteStoreItemForOwnerResult = await deleteStoreItemForOwner(session.uid, storeId, itemId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ deleted: true });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/items/[itemId] API",
      meta: { url: "/api/stores/[storeId]/items/[itemId]", method: "DELETE" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
