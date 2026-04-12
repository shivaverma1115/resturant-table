import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT } from "@/lib/constants";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreSettingsPageWrapper } from "./components/StoreSettingsPageWrapper";

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
      title: `Store settings | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return {
      title: `Store settings | ${PRODUCT.NAME}`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `${result.store.name} · Store settings | ${PRODUCT.NAME}`,
    description: `View ${result.store.name} on ${PRODUCT.NAME}. Edit on the separate edit page.`,
    robots: { index: false, follow: true },
  };
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
