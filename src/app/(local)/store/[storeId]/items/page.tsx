import type { Metadata } from "next";

import { StoreItemsPage } from "@/features/public-store/components/items/StoreItemsPage";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreItemsRoutePageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreItemsRoutePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Items",
    description: `Browse items and choose quantities for ${storeSlug}.`,
  });
}

export default async function StoreItemsRoutePage({
  params,
}: StoreItemsRoutePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  return <StoreItemsPage storeSlug={storeSlug} />;
}
