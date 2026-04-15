import type { Metadata } from "next";

import { StoreContactPage } from "@/features/public-store/components/contact/StoreContactPage";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreContactRoutePageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreContactRoutePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Contact",
    description: `Contact page for ${storeSlug}.`,
  });
}

export default async function StoreContactRoutePage({
  params,
}: StoreContactRoutePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  return <StoreContactPage storeSlug={storeSlug} />;
}
