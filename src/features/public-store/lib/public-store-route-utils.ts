import type { Metadata } from "next";

import { PRODUCT } from "@/lib/constants";

export type StoreSlugParams = Promise<{ storeId: string }>;

export async function resolveStoreSlug(params: StoreSlugParams): Promise<string> {
  const { storeId } = await params;
  return storeId;
}

export function createStorePageMetadata(options: {
  storeSlug: string;
  pageTitle: string;
  description: string;
  index?: boolean;
}): Metadata {
  const { storeSlug, pageTitle, description, index = true } = options;
  return {
    title: `${pageTitle} | ${storeSlug} | ${PRODUCT.NAME}`,
    description,
    robots: { index, follow: true },
  };
}
