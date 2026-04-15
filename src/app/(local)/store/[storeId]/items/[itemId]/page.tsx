import type { Metadata } from "next";

import { StoreItemDetailsPage } from "@/features/public-store/components/items/StoreItemDetailsPage";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreItemDetailsRoutePageProps = Readonly<{
  params: StoreSlugParams & Promise<{ itemId: string }>;
}>;

export async function generateMetadata({
  params,
}: StoreItemDetailsRoutePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Item Details",
    description: `View menu item details for ${storeSlug}.`,
  });
}

export default async function StoreItemDetailsRoutePage({
  params,
}: StoreItemDetailsRoutePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  const { itemId } = await params;
  return <StoreItemDetailsPage storeSlug={storeSlug} itemId={itemId} />;
}
