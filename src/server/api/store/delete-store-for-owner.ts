import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreDocToDto } from "./map-store-doc";
import { STORES_COLLECTION } from "./store-constants";

export type DeleteStoreForOwnerResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

/**
 * Deletes the `stores/{storeId}` document only.
 * Subcollections (tables, orders, …) are not removed — clean up via Functions or a job if needed.
 */
export async function deleteStoreForOwner(
  uid: string,
  storeId: string,
): Promise<DeleteStoreForOwnerResult> {
  const id = storeId.trim();
  if (!id || id.length > 256) {
    return { ok: false, status: 404, message: "Store not found." };
  }

  try {
    const db = getFirebaseAdminFirestore();
    const ref = db.collection(STORES_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return { ok: false, status: 404, message: "Store not found." };
    }
    const existing = mapStoreDocToDto(snap.id, snap.data());
    if (!existing || existing.ownerId !== uid) {
      return { ok: false, status: 404, message: "Store not found." };
    }

    await ref.delete();
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      message:
        "Could not delete store. Enable Cloud Firestore in your Firebase project.",
    };
  }
}
