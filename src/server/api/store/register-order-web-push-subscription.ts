import "server-only";

import { z } from "zod";

import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { getFirebaseAdminRealtimeDb } from "@/lib/firebase-admin";
import {
  RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH,
  RTDB_STORE_ORDERS_PATH,
} from "@/lib/rtdb-paths";

const subscriptionSchema = z
  .object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
    expirationTime: z.number().nullable().optional(),
  })
  .strict();

const bodySchema = z
  .object({
    notifySecret: z.string().uuid(),
    subscription: subscriptionSchema,
  })
  .strict();

const MAX_SUBS_PER_ORDER = 5;

export type RegisterOrderWebPushSubscriptionResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export async function registerOrderWebPushSubscription(
  storeId: string,
  orderId: string,
  body: unknown,
): Promise<RegisterOrderWebPushSubscriptionResult> {
  if (!isFirebaseRealtimeDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Realtime Database is not configured.",
    };
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid subscription.";
    return { ok: false, status: 400, message: msg };
  }

  const sid = storeId.trim();
  const oid = orderId.trim();
  if (!sid || !oid) {
    return { ok: false, status: 400, message: "Invalid store or order." };
  }

  try {
    const rtdb = getFirebaseAdminRealtimeDb();
    const orderRef = rtdb.ref(`${RTDB_STORE_ORDERS_PATH}/${sid}/${oid}`);
    const orderSnap = await orderRef.get();
    const orderVal = orderSnap.val() as Record<string, unknown> | null;
    if (orderVal == null) {
      return { ok: false, status: 404, message: "Order not found." };
    }
    const secret =
      typeof orderVal.notifySecret === "string" ? orderVal.notifySecret : "";
    if (!secret || secret !== parsed.data.notifySecret) {
      return { ok: false, status: 403, message: "Invalid notification token." };
    }

    const subsRef = rtdb.ref(
      `${RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH}/${sid}/${oid}`,
    );
    const subsSnap = await subsRef.get();
    const existing = subsSnap.val();
    const count =
      existing && typeof existing === "object"
        ? Object.keys(existing as Record<string, unknown>).length
        : 0;
    if (count >= MAX_SUBS_PER_ORDER) {
      return {
        ok: false,
        status: 429,
        message: "Too many devices registered for this order.",
      };
    }

    const newRef = subsRef.push();
    await newRef.set({
      subscription: parsed.data.subscription,
      createdAt: Date.now(),
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not save notification subscription.",
    };
  }
}
