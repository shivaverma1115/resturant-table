import type { Metadata } from "next";

import { StoreOrderSuccessPage } from "@/features/public-store/components/order/StoreOrderSuccessPage";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreOrderSuccessRoutePageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreOrderSuccessRoutePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Order Success",
    description: `Order confirmation preview for ${storeSlug}.`,
    index: false,
  });
}

export default async function StoreOrderSuccessRoutePage({
  params,
}: StoreOrderSuccessRoutePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  return <StoreOrderSuccessPage storeSlug={storeSlug} />;
}
