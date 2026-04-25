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

export type ListPublicStoreOrdersForUserResult =
  | {
      ok: true;
      orders: Array<{
        orderId: string;
        storeId: string;
        storeName: string;
        userId: string;
        tableLabel: string;
        status: OrderStatus;
        lines: GuestOrderTrackLineDto[];
        totalCents: number;
        createdAt: number;
      }>;
    }
  | { ok: false; status: number; message: string };

export async function listPublicStoreOrdersForUser(
  storeId: string,
  userId: string,
): Promise<ListPublicStoreOrdersForUserResult> {
  if (!isFirebaseRealtimeDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Order tracking is temporarily unavailable.",
    };
  }

  const uid = userId.trim();
  if (!uid) {
    return { ok: false, status: 400, message: "Invalid user id." };
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
  if (!sid) {
    return { ok: false, status: 400, message: "Invalid store id." };
  }

  try {
    const rtdb = getFirebaseAdminRealtimeDb();
    const query = rtdb
      .ref(`${RTDB_STORE_ORDERS_PATH}/${sid}`)
      .orderByChild("userId")
      .equalTo(uid);
    const snap = await query.get();
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    if (!val) {
      return { ok: true, orders: [] };
    }

    const orders = Object.entries(val)
      .map(([orderId, raw]) => {
        const tableLabel =
          typeof raw.tableLabel === "string" && raw.tableLabel.trim()
            ? raw.tableLabel.trim()
            : "Table";
        const status: OrderStatus = isOrderStatus(raw.status)
          ? raw.status
          : ORDER_STATUS.PENDING;
        const totalCents =
          typeof raw.totalCents === "number" && Number.isFinite(raw.totalCents)
            ? Math.round(raw.totalCents)
            : 0;
        const createdAt =
          typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt)
            ? raw.createdAt
            : 0;
        return {
          orderId,
          storeId: sid,
          storeName: pub.name,
          userId: uid,
          tableLabel,
          status,
          lines: parseLines(raw.lines),
          totalCents,
          createdAt,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return { ok: true, orders };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not load orders.",
    };
  }
}
