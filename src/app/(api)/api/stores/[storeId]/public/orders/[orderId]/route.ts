import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { getPublicStoreOrderForGuest, GetPublicStoreOrderForGuestResult } from "@/server/api/store/get-public-store-order-for-guest";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; orderId: string }>;
}>;

export async function GET(request: Request, context: RouteContext) {
  try {
    const { storeId, orderId } = await context.params;
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret") ?? "";

    const result: GetPublicStoreOrderForGuestResult = await getPublicStoreOrderForGuest(storeId, orderId, secret);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });
    return NextResponse.json(result.order);
  } catch (err: unknown) {
    logError(err, {
      context: "GET Stores [storeId]/public/orders/[orderId] route API",
      meta: { url: "/api/stores/[storeId]/public/orders/[orderId]", method: "GET" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
