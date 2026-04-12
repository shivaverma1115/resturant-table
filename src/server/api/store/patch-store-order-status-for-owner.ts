import "server-only";

import { z } from "zod";

import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { ORDER_STATUS } from "@/lib/constants";
import { getFirebaseAdminRealtimeDb } from "@/lib/firebase-admin";

import { getStoreForOwner } from "./get-store-for-owner";
import { RTDB_STORE_ORDERS_PATH } from "@/lib/rtdb-paths";

const bodySchema = z
  .object({
    status: z.enum([
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.COMPLETED,
    ]),
  })
  .strict();

export type PatchStoreOrderStatusForOwnerResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export async function patchStoreOrderStatusForOwner(
  uid: string,
  storeId: string,
  orderId: string,
  body: unknown,
): Promise<PatchStoreOrderStatusForOwnerResult> {
  if (!isFirebaseRealtimeDatabaseConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Realtime Database is not configured.",
    };
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid status.";
    return { ok: false, status: 400, message: msg };
  }

  const storeResult = await getStoreForOwner(uid, storeId);
  if (!storeResult.ok) {
    return { ok: false, status: storeResult.status, message: storeResult.message };
  }

  const sid = storeResult.store.id.trim();
  const oid = orderId.trim();
  if (!oid) {
    return { ok: false, status: 400, message: "Invalid order id." };
  }

  try {
    const rtdb = getFirebaseAdminRealtimeDb();
    const ref = rtdb.ref(`${RTDB_STORE_ORDERS_PATH}/${sid}/${oid}`);
    const snap = await ref.get();
    if (snap.val() == null) {
      return { ok: false, status: 404, message: "Order not found." };
    }
    await ref.update({ status: parsed.data.status });
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not update order.",
    };
  }
}
