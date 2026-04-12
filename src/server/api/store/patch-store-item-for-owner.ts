import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import type { StoreItemDto } from "@/features/store-items/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { getStoreForOwner } from "./get-store-for-owner";
import { mapStoreItemDocToDto } from "./map-store-item-doc";
import { STORES_COLLECTION, STORE_ITEMS_SUBCOLLECTION } from "./store-constants";

const patchItemBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.union([z.string().max(500), z.null()]).optional(),
    priceCents: z.number().int().min(0).max(10_000_000).optional(),
    sortOrder: z.number().finite().optional(),
    isAvailable: z.boolean().optional(),
  })
  .strict();

export type PatchStoreItemForOwnerResult =
  | { ok: true; item: StoreItemDto }
  | { ok: false; status: number; message: string };

export async function patchStoreItemForOwner(
  uid: string,
  storeId: string,
  itemId: string,
  body: unknown,
): Promise<PatchStoreItemForOwnerResult> {
  const sid = storeId.trim();
  const iid = itemId.trim();
  if (!sid || sid.length > 256 || !iid || iid.length > 256) {
    return { ok: false, status: 404, message: "Item not found." };
  }

  const parsed = patchItemBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const {
    name,
    description,
    priceCents,
    sortOrder,
    isAvailable,
  } = parsed.data;

  if (
    name === undefined &&
    description === undefined &&
    priceCents === undefined &&
    sortOrder === undefined &&
    isAvailable === undefined
  ) {
    return { ok: false, status: 400, message: "No updatable fields provided." };
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
    const existing = await ref.get();
    if (!existing.exists) {
      return { ok: false, status: 404, message: "Item not found." };
    }

    const patch: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (name !== undefined) {
      patch.name = name.trim();
    }
    if (description !== undefined) {
      patch.description = description;
    }
    if (priceCents !== undefined) {
      patch.priceCents = priceCents;
    }
    if (sortOrder !== undefined) {
      patch.sortOrder = sortOrder;
    }
    if (isAvailable !== undefined) {
      patch.isAvailable = isAvailable;
    }

    await ref.set(patch, { merge: true });
    const next = await ref.get();
    const dto = mapStoreItemDocToDto(next.id, next.data());
    if (!dto) {
      return {
        ok: false,
        status: 500,
        message: "Item was updated but could not be read back.",
      };
    }
    return { ok: true, item: dto };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Could not update item.",
    };
  }
}
