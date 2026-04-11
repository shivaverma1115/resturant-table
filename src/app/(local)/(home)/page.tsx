import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PRODUCT, ROUTES } from "@/lib/constants";

import { HomeMenuWrapper } from "./components/HomeMenuWrapper";

export const metadata: Metadata = {
  title: "Home",
  description: `Sign in to manage stores, tables, and QR codes. ${PRODUCT.DESCRIPTION}`,
  openGraph: {
    title: `Home | ${PRODUCT.NAME}`,
    description: `Owner dashboard and platform entry. ${PRODUCT.DESCRIPTION}`,
    url: ROUTES.HOME,
  },
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Hello World
      </h1>
      <Suspense
        fallback={<PageLoading compact message="Loading menu…" />}
      >
        <HomeMenuWrapper />
      </Suspense>
    </main>
  );
}
