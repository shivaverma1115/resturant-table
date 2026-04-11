import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import {
  PAGE_TITLES,
  PRODUCT,
  routeStoreTable,
  tableOrderMetaDescription,
} from "@/lib/constants";

import { TableOrderWrapper } from "./components/TableOrderWrapper";

type TablePageParams = { storeId: string; tableId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<TablePageParams>;
}): Promise<Metadata> {
  const { storeId, tableId } = await params;
  const title = PAGE_TITLES.TABLE_ORDER;
  const description = tableOrderMetaDescription(PRODUCT.NAME);
  const path = routeStoreTable(storeId, tableId);

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

export default function TableOrderPage() {
  return (
    <Suspense
      fallback={<PageLoading compact message="Preparing your table…" />}
    >
      <TableOrderWrapper />
    </Suspense>
  );
}
