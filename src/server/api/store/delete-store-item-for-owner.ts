import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { getStoreForOwner } from "./get-store-for-owner";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

export type DeleteStoreItemForOwnerResult =
  | { ok: true; deleted: true }
  | { ok: false; status: number; message: string };

export async function deleteStoreItemForOwner(
  uid: string,
  storeId: string,
  itemId: string,
): Promise<DeleteStoreItemForOwnerResult> {
  const sid = storeId.trim();
  const iid = itemId.trim();
  if (!sid || sid.length > 256 || !iid || iid.length > 256) {
    return { ok: false, status: 404, message: "Item not found." };
  }

  const storeResult = await getStoreForOwner(uid, sid);
  if (!storeResult.ok) {
    return {
      ok: false,
      status: storeResult.status,
      message: storeResult.message,
    };
  }

  try {
    const db = getFirebaseAdminFirestore();
    const ref = db
      .collection(STORES_COLLECTION)
      .doc(storeResult.store.id)
      .collection(STORE_ITEMS_SUBCOLLECTION)
      .doc(iid);
    const snap = await ref.get();
    if (!snap.exists) {
      return { ok: false, status: 404, message: "Item not found." };
    }
    await ref.delete();
    return { ok: true, deleted: true as const };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not delete item.",
    };
  }
}
