import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import { PAGE_TITLES, PRODUCT } from "@/lib/constants";

import { OrderTrackingView } from "./components/OrderTrackingView";
import { TrackMissingSecret } from "./components/TrackMissingSecret";

type PageParams = { storeId: string; orderId: string };
type Search = { secret?: string | string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { storeId, orderId } = await params;
  return {
    title: `${PAGE_TITLES.ORDER_TRACKING} | ${PRODUCT.NAME}`,
    description: `Track order ${orderId} for store ${storeId} on ${PRODUCT.NAME}.`,
    robots: { index: false, follow: true },
  };
}

type PageProps = Readonly<{
  params: Promise<PageParams>;
  searchParams: Promise<Search>;
}>;

export default async function GuestOrderTrackPage({
  params,
  searchParams,
}: PageProps) {
  const { storeId, orderId } = await params;
  const sp = await searchParams;
  const raw = typeof sp.secret === "string" ? sp.secret : "";
  const secret = raw.trim();

  if (!secret) {
    return <TrackMissingSecret />;
  }

  return (
    <Suspense fallback={<PageLoading compact message="Opening order…" />}>
      <OrderTrackingView
        storeId={storeId}
        orderId={orderId}
        notifySecret={secret}
      />
    </Suspense>
  );
}
