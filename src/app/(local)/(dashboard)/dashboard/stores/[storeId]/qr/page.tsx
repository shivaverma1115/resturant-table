import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { createOwnerStoreMetadata } from "@/features/dashboard/stores/lib/owner-store-metadata";

import { StoreQrPageWrapper } from "./components/StoreQrPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return createOwnerStoreMetadata({
    params,
    fallbackTitle: "Table QR",
    withStoreTitle: (storeName) => `Table QR · ${storeName}`,
  });
}

export default async function DashboardStoreQrPage({ params }: PageProps) {
  const { storeId } = await params;
  return (
    <Suspense fallback={<PageLoading compact message="Loading QR tools…" />}>
      <StoreQrPageWrapper storeId={storeId} />
    </Suspense>
  );
}
