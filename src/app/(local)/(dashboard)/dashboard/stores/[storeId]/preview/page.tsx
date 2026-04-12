import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT } from "@/lib/constants";

import { StorePreviewPageWrapper } from "./components/StorePreviewPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { storeId } = await params;
  return {
    title: `Preview store | ${PRODUCT.NAME}`,
    description: `Owner preview for store ${storeId} on ${PRODUCT.NAME}.`,
    robots: { index: false, follow: true },
  };
}

export default async function DashboardStorePreviewPage({ params }: PageProps) {
  const { storeId } = await params;

  return (
    <Suspense
      fallback={<PageLoading compact message="Loading store preview…" />}
    >
      <StorePreviewPageWrapper storeId={storeId} />
    </Suspense>
  );
}
