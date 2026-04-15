import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PRODUCT, routeStoreHome } from "@/lib/constants";

type PageProps = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { storeId } = await params;
  return {
    title: `Preview store | ${PRODUCT.NAME}`,
    description: `Owner preview for store ${storeId} on ${PRODUCT.NAME}.`,
    robots: { index: false, follow: true },
  };
}

export default async function DashboardStorePreviewPage({ params }: PageProps) {
  const { storeId } = await params;
  redirect(routeStoreHome(storeId));
}
