import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";
import { getSignupEnvStatus } from "@/server/api/auth/signup";

const SignupWrapper = nextDynamic(() => import("./components/SignupWrapper"));

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create a ${PRODUCT.NAME} store-owner account.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Create account | ${PRODUCT.NAME}`,
    url: ROUTES.SIGNUP,
  },
};

async function SignupPageContent() {
  const envStatus = getSignupEnvStatus();
  return <SignupWrapper envStatus={envStatus} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<PageLoading compact message="Loading signup…" />}>
      <SignupPageContent />
    </Suspense>
  );
}
