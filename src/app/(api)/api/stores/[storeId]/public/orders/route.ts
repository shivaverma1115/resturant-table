import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { createPublicStoreOrder, CreatePublicStoreOrderResult } from "@/server/api/store/create-public-store-order";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const result: CreatePublicStoreOrderResult = await createPublicStoreOrder(storeId, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });
    return NextResponse.json(
      { orderId: result.orderId, notifySecret: result.notifySecret },
      { status: 201 },
    );
  } catch (err: unknown) {
    logError(err, {
      context: "POST Stores [storeId]/public/orders route API",
      meta: { url: "/api/stores/[storeId]/public/orders", method: "POST" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
