import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { ROUTES } from "@/lib/constants";
import { createDashboardMetadata } from "@/features/dashboard/lib/dashboard-metadata";

import { DashboardStoresWrapper } from "./components/DashboardStoresWrapper";

export const metadata: Metadata = createDashboardMetadata({
  title: "Stores",
  description: "Manage your restaurant stores.",
  url: ROUTES.DASHBOARD_STORES,
});

export default function DashboardStoresPage() {
  return (
    <Suspense
      fallback={<PageLoading compact message="Loading stores…" />}
    >
      <DashboardStoresWrapper />
    </Suspense>
  );
}
