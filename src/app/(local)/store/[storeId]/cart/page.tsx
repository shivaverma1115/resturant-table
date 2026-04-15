import type { Metadata } from "next";

import { StoreCartPage } from "@/features/public-store/components/cart/StoreCartPage";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreCartRoutePageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreCartRoutePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Cart",
    description: `Review selected items and order summary for ${storeSlug}.`,
    index: false,
  });
}

export default async function StoreCartRoutePage({
  params,
}: StoreCartRoutePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  return <StoreCartPage storeSlug={storeSlug} />;
}
