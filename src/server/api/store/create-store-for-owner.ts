import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import type { StoreDto } from "@/features/store/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreDocToDto } from "./map-store-doc";
import { STORES_COLLECTION } from "./store-constants";

const createStoreBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    publicNote: z.union([z.string().max(500), z.null()]).optional(),
  })
  .strict();

export type CreateStoreForOwnerResult =
  | { ok: true; store: StoreDto }
  | { ok: false; status: number; message: string };

export async function createStoreForOwner(
  uid: string,
  body: unknown,
): Promise<CreateStoreForOwnerResult> {
  const parsed = createStoreBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const { name, publicNote } = parsed.data;
  const note =
    publicNote === undefined ? null : publicNote === null ? null : publicNote;

  try {
    const db = getFirebaseAdminFirestore();
    const ref = db.collection(STORES_COLLECTION).doc();
    await ref.set({
      ownerId: uid,
      name: name.trim(),
      publicNote: note,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    const dto = mapStoreDocToDto(snap.id, snap.data());
    if (!dto) {
      return {
        ok: false,
        status: 500,
        message: "Store was created but could not be read back.",
      };
    }
    return { ok: true, store: dto };
  } catch {
    return {
      ok: false,
      status: 503,
      message:
        "Could not create store. Enable Cloud Firestore in your Firebase project.",
    };
  }
}
