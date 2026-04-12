import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { registerOrderWebPushSubscription } from "@/server/api/store/register-order-web-push-subscription";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; orderId: string }>;
}>;

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId, orderId } = await context.params;
    const body: unknown = await request.json().catch(() => null);
    const result = await registerOrderWebPushSubscription(storeId, orderId, body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true as const }, { status: 201 });
  } catch (err: unknown) {
    logError(err, {
      context: "POST /api/stores/[storeId]/public/orders/[orderId]/web-push",
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
