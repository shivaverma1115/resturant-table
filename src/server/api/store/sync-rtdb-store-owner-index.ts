import "server-only";

import { isFirebaseRealtimeDatabaseConfigured } from "@/config/config";
import { getFirebaseAdminRealtimeDb } from "@/lib/firebase-admin";

import {
  RTDB_STORE_ORDERS_PATH,
  RTDB_STORE_OWNER_INDEX_PATH,
} from "@/lib/rtdb-paths";

export async function syncRtdbStoreOwnerIndex(
  storeId: string,
  ownerUid: string,
): Promise<void> {
  if (!isFirebaseRealtimeDatabaseConfigured()) return;
  const id = storeId.trim();
  const uid = ownerUid.trim();
  if (!id || !uid) return;
  try {
    const db = getFirebaseAdminRealtimeDb();
    await db.ref(`${RTDB_STORE_OWNER_INDEX_PATH}/${id}`).set(uid);
  } catch {
    /* RTDB may be disabled or rules block — non-fatal for Firestore flows */
  }
}

export async function removeRtdbStoreOwnerIndex(storeId: string): Promise<void> {
  if (!isFirebaseRealtimeDatabaseConfigured()) return;
  const id = storeId.trim();
  if (!id) return;
  try {
    const db = getFirebaseAdminRealtimeDb();
    await db.ref(`${RTDB_STORE_OWNER_INDEX_PATH}/${id}`).remove();
  } catch {
    /* ignore */
  }
}

export async function removeRtdbStoreOrdersSubtree(storeId: string): Promise<void> {
  if (!isFirebaseRealtimeDatabaseConfigured()) return;
  const id = storeId.trim();
  if (!id) return;
  try {
    const db = getFirebaseAdminRealtimeDb();
    await db.ref(`${RTDB_STORE_ORDERS_PATH}/${id}`).remove();
  } catch {
    /* ignore */
  }
}
