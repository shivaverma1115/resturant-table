import "server-only";

import type { GuestOrderTrackLineDto } from "@/features/guest-order-track/types";
import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { ORDER_STATUS, type OrderStatus } from "@/lib/constants";
import { getFirebaseAdminRealtimeDb } from "@/lib/firebase-admin";
import { RTDB_STORE_ORDERS_PATH } from "@/lib/rtdb-paths";

import { getStoreForPublicOrder } from "./get-store-for-public-order";

function isOrderStatus(v: unknown): v is OrderStatus {
  return (
    v === ORDER_STATUS.PENDING ||
    v === ORDER_STATUS.PREPARING ||
    v === ORDER_STATUS.COMPLETED
  );
}

function parseLines(raw: unknown): GuestOrderTrackLineDto[] {
  if (!Array.isArray(raw)) return [];
  const out: GuestOrderTrackLineDto[] = [];
  for (const line of raw) {
    if (!line || typeof line !== "object") continue;
    const lr = line as Record<string, unknown>;
    const itemId = typeof lr.itemId === "string" ? lr.itemId : "";
    const name = typeof lr.name === "string" ? lr.name : "Item";
    const quantity =
      typeof lr.quantity === "number" && lr.quantity > 0
        ? Math.floor(lr.quantity)
        : 1;
    const unitPriceCents =
      typeof lr.unitPriceCents === "number" && Number.isFinite(lr.unitPriceCents)
        ? Math.round(lr.unitPriceCents)
        : 0;
    const lineTotalCents =
      typeof lr.lineTotalCents === "number" && Number.isFinite(lr.lineTotalCents)
        ? Math.round(lr.lineTotalCents)
        : unitPriceCents * quantity;
    if (itemId) {
      out.push({ itemId, name, quantity, unitPriceCents, lineTotalCents });
    }
  }
  return out;
}

export type GetPublicStoreOrderForGuestResult =
  | {
      ok: true;
      order: {
        orderId: string;
        storeId: string;
        storeName: string;
        tableLabel: string;
        status: OrderStatus;
        lines: GuestOrderTrackLineDto[];
        totalCents: number;
        createdAt: number;
      };
    }
  | { ok: false; status: number; message: string };

export async function getPublicStoreOrderForGuest(
  storeId: string,
  orderId: string,
  secret: string,
): Promise<GetPublicStoreOrderForGuestResult> {
  if (!isFirebaseRealtimeDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Order tracking is temporarily unavailable.",
    };
  }

  const trimmedSecret = secret.trim();
  if (!trimmedSecret) {
    return { ok: false, status: 400, message: "Missing tracking link." };
  }

  const pub = await getStoreForPublicOrder(storeId);
  if (!pub.ok) {
    return { ok: false, status: 404, message: "Store not found." };
  }
  if (!pub.isLive) {
    return {
      ok: false,
      status: 403,
      message: "This store is not accepting orders.",
    };
  }

  const sid = storeId.trim();
  const oid = orderId.trim();
  if (!sid || !oid) {
    return { ok: false, status: 400, message: "Invalid order." };
  }

  try {
    const rtdb = getFirebaseAdminRealtimeDb();
    const snap = await rtdb.ref(`${RTDB_STORE_ORDERS_PATH}/${sid}/${oid}`).get();
    const val = snap.val() as Record<string, unknown> | null;
    if (val == null) {
      return { ok: false, status: 404, message: "Order not found." };
    }
    const storedSecret =
      typeof val.notifySecret === "string" ? val.notifySecret.trim() : "";
    if (!storedSecret || storedSecret !== trimmedSecret) {
      return { ok: false, status: 403, message: "Invalid or expired tracking link." };
    }

    const tableLabel =
      typeof val.tableLabel === "string" && val.tableLabel.trim()
        ? val.tableLabel.trim()
        : "Table";
    const status: OrderStatus = isOrderStatus(val.status)
      ? val.status
      : ORDER_STATUS.PENDING;
    const totalCents =
      typeof val.totalCents === "number" && Number.isFinite(val.totalCents)
        ? Math.round(val.totalCents)
        : 0;
    const createdAt =
      typeof val.createdAt === "number" && Number.isFinite(val.createdAt)
        ? val.createdAt
        : 0;

    return {
      ok: true,
      order: {
        orderId: oid,
        storeId: sid,
        storeName: pub.name,
        tableLabel,
        status,
        lines: parseLines(val.lines),
        totalCents,
        createdAt,
      },
    };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not load order.",
    };
  }
}
