import type { Metadata } from "next";

import { StoreLandingPage } from "@/features/public-store/components/landing/StoreLandingPage";
import {
  storeAboutPath,
  storeOrderPath,
} from "@/features/public-store/lib/public-store-paths";
import {
  createStorePageMetadata,
  resolveStoreSlug,
  type StoreSlugParams,
} from "@/features/public-store/lib/public-store-route-utils";

type StoreHomePageProps = Readonly<{
  params: StoreSlugParams;
}>;

export async function generateMetadata({
  params,
}: StoreHomePageProps): Promise<Metadata> {
  const storeSlug = await resolveStoreSlug(params);
  return createStorePageMetadata({
    storeSlug,
    pageTitle: "Home",
    description: `Public home for ${storeSlug}.`,
  });
}

export default async function StoreHomePage({ params }: StoreHomePageProps) {
  const storeSlug = await resolveStoreSlug(params);
  const orderHref = storeOrderPath(storeSlug);
  const aboutHref = storeAboutPath(storeSlug);

  return <StoreLandingPage storeSlug={storeSlug} orderHref={orderHref} aboutHref={aboutHref} />;
}
