import { NextResponse } from "next/server";
import { errorMessage } from "@/lib/helpers";
import { logError } from "@/lib/utils/logError";
import { createPublicStoreOrder, CreatePublicStoreOrderResult } from "@/server/api/store/create-public-store-order";
import { listPublicStoreOrdersForUser, ListPublicStoreOrdersForUserResult } from "@/server/api/store/list-public-store-orders-for-user";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; userId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { storeId, userId } = await context.params;
    const result: ListPublicStoreOrdersForUserResult = await listPublicStoreOrdersForUser(storeId, userId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ orders: result.orders });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/public/items/[userId]/orders route API",
      meta: { url: "/api/stores/[storeId]/public/items/[userId]/orders", method: "GET" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId, userId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const payload = { ...body, userId };
    const result: CreatePublicStoreOrderResult = await createPublicStoreOrder(storeId, payload);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json(
      { orderId: result.orderId, notifySecret: result.notifySecret },
      { status: 201 },
    );
  } catch (err: unknown) {
    logError(err, {
      context: "POST Stores [storeId]/public/items/[userId]/orders route API",
      meta: { url: "/api/stores/[storeId]/public/items/[userId]/orders", method: "POST" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
