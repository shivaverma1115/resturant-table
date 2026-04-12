import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT } from "@/lib/constants";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreEditPageWrapper } from "./components/StoreEditPageWrapper";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { storeId } = await params;
  const session = await requireSessionUid();
  if (!session.ok) {
    return {
      title: `Edit store | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return {
      title: `Edit store | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `Edit ${result.store.name} | ${PRODUCT.NAME}`,
    description: `Update ${result.store.name} on ${PRODUCT.NAME}.`,
    robots: { index: false, follow: true },
  };
}

export default async function DashboardStoreEditPage({ params }: PageProps) {
  const { storeId } = await params;

  return (
    <Suspense fallback={<PageLoading compact message="Loading editor…" />}>
      <StoreEditPageWrapper storeId={storeId} />
    </Suspense>
  );
}
