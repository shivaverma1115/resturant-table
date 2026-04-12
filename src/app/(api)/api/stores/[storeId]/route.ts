import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { deleteStoreForOwner } from "@/server/api/store/delete-store-for-owner";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";
import { patchStoreForOwner } from "@/server/api/store/patch-store-for-owner";

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
    const result = await getStoreForOwner(session.uid, storeId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json(result.store);
  } catch (err: unknown) {
    logError(err, { context: "GET /api/stores/[storeId]" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
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

    const result = await patchStoreForOwner(session.uid, storeId, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ store: result.store });
  } catch (err: unknown) {
    logError(err, { context: "PATCH /api/stores/[storeId]" });
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

    const { storeId } = await context.params;
    const result = await deleteStoreForOwner(session.uid, storeId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }

    return NextResponse.json({ deleted: true as const });
  } catch (err: unknown) {
    logError(err, { context: "DELETE /api/stores/[storeId]" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
