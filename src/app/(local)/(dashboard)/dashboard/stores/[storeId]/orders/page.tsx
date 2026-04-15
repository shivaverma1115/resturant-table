import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { createOwnerStoreMetadata } from "@/features/dashboard/stores/lib/owner-store-metadata";

import { StoreOrdersPageWrapper } from "./components/StoreOrdersPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createOwnerStoreMetadata({
    params,
    fallbackTitle: "Live orders",
    withStoreTitle: (storeName) => `Live orders · ${storeName}`,
  });
}

export default async function DashboardStoreOrdersPage({ params }: PageProps) {
  const { storeId } = await params;
  return (
    <Suspense fallback={<PageLoading compact message="Loading orders…" />}>
      <StoreOrdersPageWrapper storeId={storeId} />
    </Suspense>
  );
}
