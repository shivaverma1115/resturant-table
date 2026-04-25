import { NextResponse } from "next/server";
import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { patchStoreOrderStatusForOwner, PatchStoreOrderStatusForOwnerResult } from "@/server/api/store/patch-store-order-status-for-owner";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; orderId: string }>;
}>;

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSessionUid();
    if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

    const { storeId, orderId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const result: PatchStoreOrderStatusForOwnerResult = await patchStoreOrderStatusForOwner(
      session.uid,
      storeId,
      orderId,
      body,
    );
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ ok: true as const });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/orders/[orderId] API",
      meta: { url: "/api/stores/[storeId]/orders/[orderId]", method: "PATCH" },
    }
    );
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
