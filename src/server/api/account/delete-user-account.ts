import "server-only";

import type { DocumentReference } from "firebase-admin/firestore";

import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import {
  removeRtdbOrderWebPushSubscriptionsForStore,
  removeRtdbStoreOrdersSubtree,
  removeRtdbStoreOwnerIndex,
} from "@/server/api/store/sync-rtdb-store-owner-index";
import {
  STORES_COLLECTION,
  STORE_ITEMS_SUBCOLLECTION,
} from "@/server/api/store/store-constants";

const PROFILES_COLLECTION = "profiles" as const;
/** Same cap as store list — accounts with more stores need manual ops. */
const MAX_STORES_PER_OWNER = 200;

async function deleteItemsSubcollection(storeRef: DocumentReference): Promise<void> {
  const db = getFirebaseAdminFirestore();
  const col = storeRef.collection(STORE_ITEMS_SUBCOLLECTION);
  for (;;) {
    const snap = await col.limit(400).get();
    if (snap.empty) return;
    const batch = db.batch();
    for (const doc of snap.docs) {
      batch.delete(doc.ref);
    }
    await batch.commit();
  }
}

export type DeleteUserAccountResult =
  | { ok: true; deletedStoreCount: number }
  | { ok: false; status: number; message: string };

/**
 * Permanently removes the signed-in user's Firestore stores (and `items`
 * subcollections), Realtime Database order/index data for those stores, the
 * `profiles/{uid}` document, and the Firebase Auth user.
 */
export async function deleteUserAccount(uid: string): Promise<DeleteUserAccountResult> {
  const id = uid.trim();
  if (!id) return { ok: false, status: 400, message: "Invalid account." };

  try {
    const db = getFirebaseAdminFirestore();
    const storesSnap = await db
      .collection(STORES_COLLECTION)
      .where("ownerId", "==", id)
      .get();

    if (storesSnap.size > MAX_STORES_PER_OWNER) {
      return {
        ok: false,
        status: 400,
        message: `This account has more than ${MAX_STORES_PER_OWNER} stores. Contact support to delete it safely.`,
      };
    }

    for (const doc of storesSnap.docs) {
      const data = doc.data();
      if (typeof data?.ownerId === "string" && data.ownerId !== id) {
        continue;
      }
      const storeId = doc.id;
      await deleteItemsSubcollection(doc.ref);
      await removeRtdbStoreOwnerIndex(storeId);
      await removeRtdbStoreOrdersSubtree(storeId);
      await removeRtdbOrderWebPushSubscriptionsForStore(storeId);
      await doc.ref.delete();
    }

    await db.collection(PROFILES_COLLECTION).doc(id).delete().catch(() => {
      /* missing profile is fine */
    });

    const auth = getFirebaseAdminAuth();
    await auth.revokeRefreshTokens(id).catch(() => {
      /* user may already be partially removed */
    });
    await auth.deleteUser(id);

    return { ok: true, deletedStoreCount: storesSnap.size };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.trim() : "Could not delete account.";
    return {
      ok: false,
      status: 503,
      message: msg || "Could not delete account.",
    };
  }
}
