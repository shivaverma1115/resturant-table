import "server-only";

import { randomUUID } from "node:crypto";

import { z } from "zod";

import type { StoreItemDto } from "@/features/store-items/types";
import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { ORDER_STATUS, type OrderStatus } from "@/lib/constants";
import {
  getFirebaseAdminFirestore,
  getFirebaseAdminRealtimeDb,
} from "@/lib/firebase-admin";

import { getStoreForPublicOrder } from "./get-store-for-public-order";
import { mapStoreItemDocToDto } from "./map-store-item-doc";
import { RTDB_STORE_ORDERS_PATH } from "@/lib/rtdb-paths";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

const lineSchema = z.object({
  itemId: z.string().trim().min(1).max(128),
  quantity: z.number().int().min(1).max(99),
});

const bodySchema = z
  .object({
    tableLabel: z.string().min(1).max(80),
    userId: z.string().trim().min(1).max(128).optional(),
    lines: z.array(lineSchema).min(1).max(40),
  })
  .strict();

function sanitizeTableLabel(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 80);
}

export type CreatePublicStoreOrderResult =
  | { ok: true; orderId: string; notifySecret: string }
  | { ok: false; status: number; message: string };

export async function createPublicStoreOrder(
  storeId: string,
  body: unknown,
): Promise<CreatePublicStoreOrderResult> {
  if (!isFirebaseRealtimeDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      message:
        "Orders are not available: set NEXT_PUBLIC_FIREBASE_DATABASE_URL and create a Realtime Database instance in Firebase.",
    };
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid order.";
    return { ok: false, status: 400, message: msg };
  }

  const tableLabel = sanitizeTableLabel(parsed.data.tableLabel);
  if (!tableLabel) {
    return { ok: false, status: 400, message: "Enter a table or area label." };
  }
  const userId = parsed.data.userId?.trim() ?? "";

  const pub = await getStoreForPublicOrder(storeId);
  if (!pub.ok) {
    return { ok: false, status: 404, message: "Store not found." };
  }
  if (!pub.isLive) {
    return {
      ok: false,
      status: 403,
      message: "This store is not accepting orders yet.",
    };
  }

  const id = storeId.trim();
  try {
    const fs = getFirebaseAdminFirestore();
    const snap = await fs
      .collection(STORES_COLLECTION)
      .doc(id)
      .collection(STORE_ITEMS_SUBCOLLECTION)
      .get();

    const byId = new Map<string, StoreItemDto>();
    for (const doc of snap.docs) {
      const dto = mapStoreItemDocToDto(doc.id, doc.data());
      if (dto) byId.set(doc.id, dto);
    }

    type LineOut = {
      itemId: string;
      name: string;
      quantity: number;
      unitPriceCents: number;
      lineTotalCents: number;
    };

    const linesOut: LineOut[] = [];
    let totalCents = 0;

    for (const line of parsed.data.lines) {
      const item = byId.get(line.itemId.trim());
      if (!item || !item.isAvailable) {
        return {
          ok: false,
          status: 400,
          message: "One or more items are unavailable or unknown.",
        };
      }
      const lineTotalCents = item.priceCents * line.quantity;
      totalCents += lineTotalCents;
      linesOut.push({
        itemId: item.id,
        name: item.name,
        quantity: line.quantity,
        unitPriceCents: item.priceCents,
        lineTotalCents,
      });
    }

    const rtdb = getFirebaseAdminRealtimeDb();
    const ref = rtdb.ref(`${RTDB_STORE_ORDERS_PATH}/${id}`).push();
    const orderId = ref.key;
    if (!orderId) {
      return { ok: false, status: 500, message: "Could not create order id." };
    }

    const status: OrderStatus = ORDER_STATUS.PENDING;
    const notifySecret = randomUUID();
    await ref.set({
      tableLabel,
      userId: userId || null,
      status,
      lines: linesOut,
      totalCents,
      createdAt: Date.now(),
      notifySecret,
    });

    return { ok: true, orderId, notifySecret };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not place order. Check Firestore and Realtime Database.",
    };
  }
}
