import { StoreAboutPage } from "@/features/public-store/components/about/StoreAboutPage";

type StoreAboutViewProps = Readonly<{
  storeSlug: string;
}>;

export function StoreAboutView({ storeSlug }: StoreAboutViewProps) {
  return <StoreAboutPage storeSlug={storeSlug} />;
}
