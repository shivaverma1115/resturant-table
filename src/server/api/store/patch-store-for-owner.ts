import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import type { StoreDto } from "@/features/store/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreDocToDto } from "./map-store-doc";
import { STORES_COLLECTION } from "./store-constants";

const patchStoreBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    publicNote: z.union([z.string().max(500), z.null()]).optional(),
  })
  .strict();

export type PatchStoreForOwnerResult =
  | { ok: true; store: StoreDto }
  | { ok: false; status: number; message: string };

export async function patchStoreForOwner(
  uid: string,
  storeId: string,
  body: unknown,
): Promise<PatchStoreForOwnerResult> {
  const id = storeId.trim();
  if (!id || id.length > 256) {
    return { ok: false, status: 404, message: "Store not found." };
  }

  const parsed = patchStoreBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const { name, publicNote } = parsed.data;
  if (name === undefined && publicNote === undefined) {
    return {
      ok: false,
      status: 400,
      message: "No updatable fields provided.",
    };
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

    const patch: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (name !== undefined) {
      patch.name = name.trim();
    }
    if (publicNote !== undefined) {
      patch.publicNote = publicNote;
    }

    await ref.set(patch, { merge: true });
    const next = await ref.get();
    const dto = mapStoreDocToDto(next.id, next.data());
    if (!dto) {
      return {
        ok: false,
        status: 500,
        message: "Store was updated but could not be read back.",
      };
    }
    return { ok: true, store: dto };
  } catch {
    return {
      ok: false,
      status: 503,
      message:
        "Could not update store. Enable Cloud Firestore in your Firebase project.",
    };
  }
}
