import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import { DashboardHomeWrapper } from "./components/DashboardHomeWrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: `Store owner home — stores, tables, and orders on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Dashboard | ${PRODUCT.NAME}`,
    url: ROUTES.DASHBOARD,
  },
};

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
