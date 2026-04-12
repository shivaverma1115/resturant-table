import "server-only";

import type { DocumentData } from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

import type { StoreItemDto } from "@/features/store-items/types";

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

export function mapStoreItemDocToDto(
  id: string,
  data: DocumentData | undefined,
): StoreItemDto | null {
  if (!data) {
    return null;
  }
  const rawName = data.name;
  const name =
    typeof rawName === "string" && rawName.trim().length > 0
      ? rawName.trim()
      : null;
  if (!name) {
    return null;
  }

  let description: string | null = null;
  if (typeof data.description === "string") {
    description = data.description;
  } else if (data.description === null) {
    description = null;
  }

  const priceRaw = data.priceCents;
  const priceCents =
    typeof priceRaw === "number" &&
    Number.isFinite(priceRaw) &&
    priceRaw >= 0 &&
    Number.isInteger(priceRaw)
      ? priceRaw
      : 0;

  const sortOrder =
    typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)
      ? data.sortOrder
      : 0;

  const isAvailable =
    typeof data.isAvailable === "boolean" ? data.isAvailable : true;

  const createdAt =
    timestampToIso(data.createdAt) ?? new Date(0).toISOString();
  const updatedAt = timestampToIso(data.updatedAt) ?? createdAt;

  return {
    id,
    name,
    description,
    priceCents,
    sortOrder,
    isAvailable,
    createdAt,
    updatedAt,
  };
}
