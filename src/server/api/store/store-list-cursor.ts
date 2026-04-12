import "server-only";

import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

/** Opaque cursor for `GET /api/stores` pagination (owner-scoped list). */
export function encodeStoreListCursor(
  doc: QueryDocumentSnapshot,
): string {
  const createdAt = doc.get("createdAt");
  const millis =
    createdAt instanceof Timestamp ? createdAt.toMillis() : 0;
  const payload = JSON.stringify({ c: millis, i: doc.id });
  return Buffer.from(payload, "utf8").toString("base64url");
}

export function decodeStoreListCursor(
  token: string,
): { millis: number; id: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof (parsed as { c: unknown }).c !== "number" ||
      typeof (parsed as { i: unknown }).i !== "string"
    ) {
      return null;
    }
    const { c, i } = parsed as { c: number; i: string };
    if (!Number.isFinite(c) || i.length === 0 || i.length > 256) {
      return null;
    }
    return { millis: c, id: i };
  } catch {
    return null;
  }
}
