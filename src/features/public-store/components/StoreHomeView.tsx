import { StoreLandingPage } from "@/features/public-store/components/landing/StoreLandingPage";

type StoreHomeViewProps = Readonly<{
  storeSlug: string;
  orderHref: string;
  aboutHref: string;
}>;

export function StoreHomeView({
  storeSlug,
  orderHref,
  aboutHref,
}: StoreHomeViewProps) {
  return <StoreLandingPage storeSlug={storeSlug} orderHref={orderHref} aboutHref={aboutHref} />;
}
