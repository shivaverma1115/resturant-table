import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { createPublicStoreOrder } from "@/server/api/store/create-public-store-order";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId } = await context.params;
    const body: unknown = await request.json().catch(() => null);
    const result = await createPublicStoreOrder(storeId, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json({ orderId: result.orderId }, { status: 201 });
  } catch (err: unknown) {
    logError(err, { context: "POST /api/stores/[storeId]/public/orders" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
