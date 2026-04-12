import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { getPublicStoreOrderForGuest } from "@/server/api/store/get-public-store-order-for-guest";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; orderId: string }>;
}>;

export async function GET(request: Request, context: RouteContext) {
  try {
    const { storeId, orderId } = await context.params;
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret") ?? "";

    const result = await getPublicStoreOrderForGuest(storeId, orderId, secret);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json(result.order);
  } catch (err: unknown) {
    logError(err, { context: "GET /api/stores/[storeId]/public/orders/[orderId]" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
