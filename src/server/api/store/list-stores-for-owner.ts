import "server-only";

import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

import type { StoreDto } from "@/features/store/types";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { mapStoreDocToDto } from "./map-store-doc";
import { STORES_COLLECTION } from "./store-constants";
import {
  decodeStoreListCursor,
  encodeStoreListCursor,
} from "./store-list-cursor";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;
/** Without a composite index, we load all of an owner’s stores in one query; keep a hard cap. */
const MAX_STORES_SCAN_PER_OWNER = 200;

function getCreatedMillis(doc: QueryDocumentSnapshot): number {
  const v = doc.get("createdAt");
  if (v instanceof Timestamp) {
    return v.toMillis();
  }
  if (
    v &&
    typeof v === "object" &&
    "toMillis" in v &&
    typeof (v as { toMillis: unknown }).toMillis === "function"
  ) {
    const n = (v as { toMillis: () => number }).toMillis();
    return typeof n === "number" && Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Matches Firestore `orderBy(createdAt, desc).orderBy(documentId(), desc)`. */
function compareStoresDesc(
  a: QueryDocumentSnapshot,
  b: QueryDocumentSnapshot,
): number {
  const ma = getCreatedMillis(a);
  const mb = getCreatedMillis(b);
  if (ma !== mb) {
    return mb - ma;
  }
  return b.id.localeCompare(a.id);
}

export type ListStoresForOwnerResult =
  | { ok: true; stores: StoreDto[]; nextCursor: string | null }
  | { ok: false; status: number; message: string };

export async function listStoresForOwner(
  uid: string,
  cursor: string | null,
  limitInput: number | undefined,
): Promise<ListStoresForOwnerResult> {
  const limit = Math.min(
    Math.max(Number(limitInput) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  try {
    const db = getFirebaseAdminFirestore();
    const snap = await db
      .collection(STORES_COLLECTION)
      .where("ownerId", "==", uid)
      .get();

    if (snap.size > MAX_STORES_SCAN_PER_OWNER) {
      return {
        ok: false,
        status: 400,
        message: `This account has more than ${MAX_STORES_SCAN_PER_OWNER} stores. Add the Firestore composite index from firebase/firestore.indexes.json and switch the list query back to server-side orderBy + cursor pagination, or archive old stores.`,
      };
    }

    const sorted = [...snap.docs].sort(compareStoresDesc);

    let startIndex = 0;
    if (cursor?.trim()) {
      const decoded = decodeStoreListCursor(cursor.trim());
      if (!decoded) {
        return { ok: false, status: 400, message: "Invalid cursor." };
      }
      const idx = sorted.findIndex(
        (d) =>
          getCreatedMillis(d) === decoded.millis && d.id === decoded.id,
      );
      if (idx === -1) {
        return {
          ok: false,
          status: 400,
          message: "Cursor is no longer valid. Refetch the first page.",
        };
      }
      startIndex = idx + 1;
    }

    const pageDocs = sorted.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + pageDocs.length < sorted.length;

    const stores: StoreDto[] = [];
    for (const doc of pageDocs) {
      const dto = mapStoreDocToDto(doc.id, doc.data());
      if (dto) stores.push(dto);
    }

    const lastDoc = pageDocs[pageDocs.length - 1];
    const nextCursor =
      hasMore && lastDoc ? encodeStoreListCursor(lastDoc) : null;

    return { ok: true, stores, nextCursor };
  } catch (err: unknown) {
    const raw =
      err instanceof Error
        ? err.message
        : "Could not load stores. Enable Cloud Firestore in your Firebase project.";
    return {
      ok: false,
      status: 503,
      message: raw,
    };
  }
}
