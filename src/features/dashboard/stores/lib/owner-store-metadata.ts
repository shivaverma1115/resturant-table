import type { Metadata } from "next";

import { PRODUCT } from "@/lib/constants";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

type OwnerStoreMetadataOptions = Readonly<{
  params: Promise<{ storeId: string }>;
  fallbackTitle: string;
  withStoreTitle: (storeName: string) => string;
  withStoreDescription?: (storeName: string) => string;
}>;

export async function createOwnerStoreMetadata({
  params,
  fallbackTitle,
  withStoreTitle,
  withStoreDescription,
}: OwnerStoreMetadataOptions): Promise<Metadata> {
  const { storeId } = await params;
  const session = await requireSessionUid();
  if (!session.ok) {
    return {
      title: `${fallbackTitle} | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return {
      title: `${fallbackTitle} | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `${withStoreTitle(result.store.name)} | ${PRODUCT.NAME}`,
    ...(withStoreDescription
      ? { description: withStoreDescription(result.store.name) }
      : {}),
    robots: { index: false, follow: true },
  };
}
