import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { STORES_COLLECTION } from "./store-constants";

export type GetStoreForPublicOrderResult =
  | {
      ok: true;
      name: string;
      publicNote: string | null;
      /** Missing field defaults to `true` so older stores stay public. */
      isLive: boolean;
    }
  | { ok: false; reason: "missing" };

/**
 * Read store visibility for the public QR ordering route (no auth).
 * Does not expose owner-only fields.
 */
export async function getStoreForPublicOrder(
  storeId: string,
): Promise<GetStoreForPublicOrderResult> {
  const id = storeId.trim();
  if (!id || id.length > 256) {
    return { ok: false, reason: "missing" };
  }

  try {
    const db = getFirebaseAdminFirestore();
    const snap = await db.collection(STORES_COLLECTION).doc(id).get();
    if (!snap.exists) {
      return { ok: false, reason: "missing" };
    }
    const data = snap.data();
    if (!data) {
      return { ok: false, reason: "missing" };
    }

    const rawName = data.name;
    const name =
      typeof rawName === "string" && rawName.trim().length > 0
        ? rawName.trim()
        : "Restaurant";

    let publicNote: string | null = null;
    if (typeof data.publicNote === "string") {
      publicNote = data.publicNote;
    } else if (data.publicNote === null) {
      publicNote = null;
    }

    const isLive =
      typeof data.isLive === "boolean" ? data.isLive : true;

    return { ok: true, name, publicNote, isLive };
  } catch {
    return { ok: false, reason: "missing" };
  }
}
