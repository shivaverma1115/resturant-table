import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  PAGE_TITLES,
  PRODUCT,
  routeStoreOrderAtTable,
  tableOrderMetaDescription,
} from "@/lib/constants";

type TablePageParams = { storeId: string; tableId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<TablePageParams>;
}): Promise<Metadata> {
  const { storeId, tableId } = await params;
  const title = PAGE_TITLES.TABLE_ORDER;
  const description = tableOrderMetaDescription(PRODUCT.NAME);
  const path = routeStoreOrderAtTable(storeId, tableId);

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${title} | ${PRODUCT.NAME}`,
      description,
      url: path,
    },
    alternates: {
      canonical: path,
    },
  };
}

type TableOrderPageProps = Readonly<{
  params: Promise<TablePageParams>;
}>;

/** Legacy path — forwards to `/store/.../order?table=...` so table labels can use any characters. */
export default async function LegacyTableOrderPage({ params }: TableOrderPageProps) {
  const { storeId, tableId } = await params;
  redirect(routeStoreOrderAtTable(storeId, tableId));
}
