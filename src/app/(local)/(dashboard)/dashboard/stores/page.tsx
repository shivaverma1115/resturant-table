import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import { DashboardStoresWrapper } from "./components/DashboardStoresWrapper";

export const metadata: Metadata = {
  title: "Stores",
  description: `Manage your restaurant stores on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Stores | ${PRODUCT.NAME}`,
    url: ROUTES.DASHBOARD_STORES,
  },
};

export default function DashboardStoresPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={<PageLoading compact message="Loading stores…" />}
      >
        <DashboardStoresWrapper />
      </Suspense>
    </main>
  );
}
