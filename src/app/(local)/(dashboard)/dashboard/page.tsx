import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { ROUTES } from "@/lib/constants";
import { createDashboardMetadata } from "@/features/dashboard/lib/dashboard-metadata";

import { DashboardHomeWrapper } from "./components/DashboardHomeWrapper";

export const metadata: Metadata = createDashboardMetadata({
  title: "Dashboard",
  description: "Store owner home — stores, tables, and orders.",
  url: ROUTES.DASHBOARD,
});

export default function DashboardHomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={<PageLoading compact message="Loading dashboard…" />}
      >
        <DashboardHomeWrapper />
      </Suspense>
    </main>
  );
}
