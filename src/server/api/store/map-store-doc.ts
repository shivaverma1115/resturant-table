import "server-only";

import type { DocumentData } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

import type { StoreDto } from "@/features/store/types";

function timestampToIso(value: unknown): string | null {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  ) {
    const d = (value as { toDate: () => Date }).toDate();
    return d.toISOString();
  }
  return null;
}

/** Maps a Firestore `stores` document to an API DTO; returns `null` if data is invalid. */
export function mapStoreDocToDto(
  id: string,
  data: DocumentData | undefined,
): StoreDto | null {
  if (!data || typeof data.ownerId !== "string") {
    return null;
  }

  const rawName = data.name;
  const name =
    typeof rawName === "string" && rawName.trim().length > 0
      ? rawName.trim()
      : "Untitled";

  let publicNote: string | null = null;
  if (typeof data.publicNote === "string") {
    publicNote = data.publicNote;
  } else if (data.publicNote === null) {
    publicNote = null;
  }

  const createdAt =
    timestampToIso(data.createdAt) ?? new Date(0).toISOString();
  const updatedAt =
    timestampToIso(data.updatedAt) ?? createdAt;

  return {
    id,
    ownerId: data.ownerId,
    name,
    publicNote,
    createdAt,
    updatedAt,
  };
}
