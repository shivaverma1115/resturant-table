import { NextResponse } from "next/server";
import { logError } from "@/lib/utils/logError";
import { registerOrderWebPushSubscription, RegisterOrderWebPushSubscriptionResult } from "@/server/api/store/register-order-web-push-subscription";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string; orderId: string }>;
}>;

export async function POST(request: Request, context: RouteContext) {
  try {
    const { storeId, orderId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const result: RegisterOrderWebPushSubscriptionResult = await registerOrderWebPushSubscription(storeId, orderId, body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });
    return NextResponse.json({ ok: true as const }, { status: 201 });
  } catch (err: unknown) {
    logError(err, {
      context: "POST Stores [storeId]/public/orders/[orderId]/web-push route API",
      meta: { url: "/api/stores/[storeId]/public/orders/[orderId]/web-push", method: "POST" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}
