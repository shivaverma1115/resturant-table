import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { ROUTES } from "@/lib/constants";
import { createDashboardMetadata } from "@/features/dashboard/lib/dashboard-metadata";

import ProfileWrapper from "./components/ProfileWrapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createDashboardMetadata({
  title: "Profile",
  description: "Your account and business profile.",
  url: ROUTES.DASHBOARD_PROFILE,
});

export default function DashboardProfilePage() {
  return (
    <Suspense fallback={<PageLoading compact message="Loading profile…" />}>
      <ProfileWrapper />
    </Suspense>
  );
}
