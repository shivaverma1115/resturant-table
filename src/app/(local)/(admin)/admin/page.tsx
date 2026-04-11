import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import { AdminHomeWrapper } from "./components/AdminHomeWrapper";

export const metadata: Metadata = {
  title: "Admin",
  description: `Platform administration for ${PRODUCT.NAME}.`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `Admin | ${PRODUCT.NAME}`,
    url: ROUTES.ADMIN,
  },
};

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense
        fallback={<PageLoading compact message="Loading admin…" />}
      >
        <AdminHomeWrapper />
      </Suspense>
    </main>
  );
}
