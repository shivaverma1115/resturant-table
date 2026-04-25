import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { deleteStoreForOwner, DeleteStoreForOwnerResult } from "@/server/api/store/delete-store-for-owner";
import { getStoreForOwner, GetStoreForOwnerResult } from "@/server/api/store/get-store-for-owner";
import { patchStoreForOwner, PatchStoreForOwnerResult } from "@/server/api/store/patch-store-for-owner";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId } = await context.params;
    const result: GetStoreForOwnerResult = await getStoreForOwner(session.uid, storeId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json(result.store);
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId] API",
      meta: { url: "/api/stores/[storeId]", method: "GET" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result: PatchStoreForOwnerResult = await patchStoreForOwner(session.uid, storeId, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ store: result.store });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId] API",
      meta: { url: "/api/stores/[storeId]", method: "PATCH" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId } = await context.params;
    const result: DeleteStoreForOwnerResult = await deleteStoreForOwner(session.uid, storeId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ deleted: true as const });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId] API",
      meta: { url: "/api/stores/[storeId]", method: "DELETE" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
