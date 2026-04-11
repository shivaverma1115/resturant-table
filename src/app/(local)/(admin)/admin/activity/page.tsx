import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import { AdminActivityWrapper } from "./components/AdminActivityWrapper";

export const metadata: Metadata = {
  title: "Activity",
  description: `Platform activity and audits on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `Admin activity | ${PRODUCT.NAME}`,
    url: ROUTES.ADMIN_ACTIVITY,
  },
};

export default function AdminActivityPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={<PageLoading compact message="Loading activity…" />}
      >
        <AdminActivityWrapper />
      </Suspense>
    </main>
  );
}
