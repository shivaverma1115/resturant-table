import "server-only";

import webpush from "web-push";

import { routeStoreOrderTrack, type OrderStatus } from "@/lib/constants";
import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { getFirebaseAdminRealtimeDb } from "@/lib/firebase-admin";
import { RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH } from "@/lib/rtdb-paths";

import {
  getVapidSubject,
  isWebPushConfiguredForServer,
} from "./web-push-order-config";

let vapidReady = false;

function ensureWebPushVapid(): boolean {
  if (vapidReady) return true;
  if (!isWebPushConfiguredForServer()) return false;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY!.trim();
  webpush.setVapidDetails(getVapidSubject(), publicKey, privateKey);
  vapidReady = true;
  return true;
}

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Received";
    case "preparing":
      return "Being prepared";
    case "completed":
      return "Ready / completed";
    default:
      return status;
  }
}

type PushSubscriptionLike = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
};

export async function sendOrderStatusWebPushes(params: {
  storeId: string;
  orderId: string;
  storeName: string;
  tableLabel: string;
  status: OrderStatus;
  /** Same as RTDB `notifySecret` — opens guest tracking when present. */
  notifySecret?: string | null;
}): Promise<void> {
  if (!isFirebaseRealtimeDatabaseConfigured()) return;
  if (!ensureWebPushVapid()) return;

  const { storeId, orderId, storeName, tableLabel, status, notifySecret } = params;
  const sid = storeId.trim();
  const oid = orderId.trim();
  if (!sid || !oid) return;

  const title = storeName.trim() || "Your order";
  const body = `${statusLabel(status)} · Table ${tableLabel}`;
  const secret = notifySecret?.trim() ?? "";
  const trackUrl = secret
    ? routeStoreOrderTrack(sid, oid, secret)
    : `/store/${encodeURIComponent(sid)}/order?table=${encodeURIComponent(tableLabel)}`;
  const payload = JSON.stringify({
    title,
    body,
    url: trackUrl,
  });

  try {
    const rtdb = getFirebaseAdminRealtimeDb();
    const subsSnap = await rtdb
      .ref(`${RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH}/${sid}/${oid}`)
      .get();
    const val = subsSnap.val() as Record<
      string,
      { subscription?: PushSubscriptionLike }
    > | null;
    if (!val || typeof val !== "object") return;

    for (const [subKey, row] of Object.entries(val)) {
      const sub = row?.subscription;
      if (!sub?.endpoint || !sub.keys?.auth || !sub.keys?.p256dh) continue;
      try {
        await webpush.sendNotification(sub, payload, {
          TTL: 86_400,
        });
      } catch (e: unknown) {
        const statusCode =
          e && typeof e === "object" && "statusCode" in e
            ? (e as { statusCode?: number }).statusCode
            : undefined;
        if (statusCode === 404 || statusCode === 410) {
          await rtdb
            .ref(
              `${RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH}/${sid}/${oid}/${subKey}`,
            )
            .remove();
        }
      }
    }
  } catch {
    /* non-fatal */
  }
}
