import type { Metadata } from "next";

import { PRODUCT } from "@/lib/constants";

type StaticDashboardMetadataOptions = Readonly<{
  title: string;
  description: string;
  url?: string;
}>;

export function createDashboardMetadata({
  title,
  description,
  url,
}: StaticDashboardMetadataOptions): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${title} | ${PRODUCT.NAME}`,
      ...(url ? { url } : {}),
    },
  };
}
