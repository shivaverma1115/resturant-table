import "server-only";

import type { StoreItemDto } from "@/features/store-items/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreItemDocToDto } from "./map-store-item-doc";
import { getStoreForOwner } from "./get-store-for-owner";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

export type ListStoreItemsForOwnerResult =
  | { ok: true; items: StoreItemDto[] }
  | { ok: false; status: number; message: string };

export async function listStoreItemsForOwner(
  uid: string,
  storeId: string,
): Promise<ListStoreItemsForOwnerResult> {
  const storeResult = await getStoreForOwner(uid, storeId);
  if (!storeResult.ok) {
    return {
      ok: false,
      status: storeResult.status,
      message: storeResult.message,
    };
  }

  try {
    const db = getFirebaseAdminFirestore();
    const snap = await db
      .collection(STORES_COLLECTION)
      .doc(storeResult.store.id)
      .collection(STORE_ITEMS_SUBCOLLECTION)
      .orderBy("sortOrder", "asc")
      .get();

    const items: StoreItemDto[] = [];
    for (const doc of snap.docs) {
      const dto = mapStoreItemDocToDto(doc.id, doc.data());
      if (dto) {
        items.push(dto);
      }
    }
    items.sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "en"),
    );
    return { ok: true, items };
  } catch {
    return {
      ok: false,
      status: 503,
      message:
        "Could not load menu items. Enable Cloud Firestore for your project.",
    };
  }
}
