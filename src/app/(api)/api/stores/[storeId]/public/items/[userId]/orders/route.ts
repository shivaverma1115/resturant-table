import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { createPublicStoreOrder } from "@/server/api/store/create-public-store-order";
import { listPublicStoreOrdersForUser } from "@/server/api/store/list-public-store-orders-for-user";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; userId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { storeId, userId } = await context.params;
    const result = await listPublicStoreOrdersForUser(storeId, userId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json({ orders: result.orders });
  } catch (err: unknown) {
    logError(err, {
      context: "GET /api/stores/[storeId]/public/items/[userId]/orders",
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId, userId } = await context.params;
    const body: unknown = await request.json().catch(() => null);
    const payload =
      body && typeof body === "object"
        ? { ...(body as Record<string, unknown>), userId }
        : { userId };
    const result = await createPublicStoreOrder(storeId, payload);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json(
      { orderId: result.orderId, notifySecret: result.notifySecret },
      { status: 201 },
    );
  } catch (err: unknown) {
    logError(err, {
      context: "POST /api/stores/[storeId]/public/items/[userId]/orders",
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
