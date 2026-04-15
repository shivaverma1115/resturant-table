import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { createOwnerStoreMetadata } from "@/features/dashboard/stores/lib/owner-store-metadata";

import { StoreEditPageWrapper } from "./components/StoreEditPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return createOwnerStoreMetadata({
    params,
    fallbackTitle: "Edit store",
    withStoreTitle: (storeName) => `Edit ${storeName}`,
    withStoreDescription: (storeName) => `Update ${storeName}.`,
  });
}

export default async function DashboardStoreEditPage({ params }: PageProps) {
  const { storeId } = await params;

  return (
    <Suspense fallback={<PageLoading compact message="Loading editor…" />}>
      <StoreEditPageWrapper storeId={storeId} />
    </Suspense>
  );
}
