import type { Metadata } from "next";

import { StoreAboutView } from "@/features/public-store/components/StoreAboutView";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreAboutPageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreAboutPageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "About",
    description: `About, hours, and contact details for ${storeSlug}.`,
  });
}

export default async function StoreAboutPage({ params }: StoreAboutPageProps) {
  const storeSlug = await resolveStoreSlug(params);

  return <StoreAboutView storeSlug={storeSlug} />;
}
