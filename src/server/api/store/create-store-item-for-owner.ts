import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import type { StoreItemDto } from "@/features/store-items/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { getStoreForOwner } from "./get-store-for-owner";
import { mapStoreItemDocToDto } from "./map-store-item-doc";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

const createItemBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    description: z.union([z.string().max(500), z.null()]).optional(),
    priceCents: z.number().int().min(0).max(10_000_000),
    isAvailable: z.boolean().optional(),
  })
  .strict();

export type CreateStoreItemForOwnerResult =
  | { ok: true; item: StoreItemDto }
  | { ok: false; status: number; message: string };

export async function createStoreItemForOwner(
  uid: string,
  storeId: string,
  body: unknown,
): Promise<CreateStoreItemForOwnerResult> {
  const parsed = createItemBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const storeResult = await getStoreForOwner(uid, storeId);
  if (!storeResult.ok) {
    return {
      ok: false,
      status: storeResult.status,
      message: storeResult.message,
    };
  }

  const { name, description, priceCents, isAvailable } = parsed.data;
  const desc =
    description === undefined ? null : description === null ? null : description;
  const available = isAvailable ?? true;
  const sortOrder = Date.now();

  try {
    const db = getFirebaseAdminFirestore();
    const col = db
      .collection(STORES_COLLECTION)
      .doc(storeResult.store.id)
      .collection(STORE_ITEMS_SUBCOLLECTION);
    const ref = col.doc();
    await ref.set({
      name: name.trim(),
      description: desc,
      priceCents,
      sortOrder,
      isAvailable: available,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    const dto = mapStoreItemDocToDto(snap.id, snap.data());
    if (!dto) {
      return {
        ok: false,
        status: 500,
        message: "Item was created but could not be read back.",
      };
    }
    return { ok: true, item: dto };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not create item. Check Firestore is enabled.",
    };
  }
}
