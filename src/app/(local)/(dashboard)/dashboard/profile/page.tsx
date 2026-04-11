import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import ProfileWrapper from "./components/ProfileWrapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
  description: `Your account and business profile on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Profile | ${PRODUCT.NAME}`,
    url: ROUTES.DASHBOARD_PROFILE,
  },
};

export default function DashboardProfilePage() {
  return (
    <Suspense fallback={<PageLoading compact message="Loading profile…" />}>
      <ProfileWrapper />
    </Suspense>
  );
}
