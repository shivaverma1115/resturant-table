import "server-only";

import type { StoreItemDto } from "@/features/store-items/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { getStoreForPublicOrder } from "./get-store-for-public-order";
import { mapStoreItemDocToDto } from "./map-store-item-doc";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

export type ListStoreItemsForPublicResult =
  | { ok: true; items: StoreItemDto[] }
  | { ok: false; status: number; message: string };

export async function listStoreItemsForPublic(
  storeId: string,
): Promise<ListStoreItemsForPublicResult> {
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
    const db = getFirebaseAdminFirestore();
    const snap = await db
      .collection(STORES_COLLECTION)
      .doc(id)
      .collection(STORE_ITEMS_SUBCOLLECTION)
      .orderBy("sortOrder", "asc")
      .get();

    const items: StoreItemDto[] = [];
    for (const doc of snap.docs) {
      const dto = mapStoreItemDocToDto(doc.id, doc.data());
      if (dto && dto.isAvailable) {
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
