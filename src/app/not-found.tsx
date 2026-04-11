import type { Metadata } from "next";

import { PageNotFound } from "@/components/shared/PageNotFound";
import { PRODUCT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
  description: `We could not find that page on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
};

export default function RootNotFound() {
  return <PageNotFound />;
}
