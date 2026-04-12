import "server-only";

import type { StoreDto } from "@/features/store/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreDocToDto } from "./map-store-doc";
import { STORES_COLLECTION } from "./store-constants";

export type GetStoreForOwnerResult =
  | { ok: true; store: StoreDto }
  | { ok: false; status: 404 | 503; message: string };

export async function getStoreForOwner(
  uid: string,
  storeId: string,
): Promise<GetStoreForOwnerResult> {
  const id = storeId.trim();
  if (!id || id.length > 256) {
    return { ok: false, status: 404, message: "Store not found." };
  }

  try {
    const db = getFirebaseAdminFirestore();
    const snap = await db.collection(STORES_COLLECTION).doc(id).get();
    if (!snap.exists) {
      return { ok: false, status: 404, message: "Store not found." };
    }
    const dto = mapStoreDocToDto(snap.id, snap.data());
    if (!dto || dto.ownerId !== uid) {
      return { ok: false, status: 404, message: "Store not found." };
    }
    return { ok: true, store: dto };
  } catch {
    return {
      ok: false,
      status: 503,
      message:
        "Could not load store. Enable Cloud Firestore in your Firebase project.",
    };
  }
}
