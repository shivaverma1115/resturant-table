import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { createOwnerStoreMetadata } from "@/features/dashboard/stores/lib/owner-store-metadata";

import { StoreSettingsPageWrapper } from "./components/StoreSettingsPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return createOwnerStoreMetadata({
    params,
    fallbackTitle: "Store settings",
    withStoreTitle: (storeName) => `${storeName} · Store settings`,
    withStoreDescription: (storeName) =>
      `View ${storeName}. Edit on the separate edit page.`,
  });
}

export default async function DashboardStoreIdSettingsPage({
  params,
}: PageProps) {
  const { storeId } = await params;

  return (
    <Suspense
      fallback={<PageLoading compact message="Loading store settings…" />}
    >
      <StoreSettingsPageWrapper storeId={storeId} />
    </Suspense>
  );
}
