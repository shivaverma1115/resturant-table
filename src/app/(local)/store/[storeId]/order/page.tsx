import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoading } from "@/components/shared/PageLoading";
import {
  PAGE_TITLES,
  PRODUCT,
  ROUTE_SEGMENTS,
  routeStoreOrderAtTable,
  tableOrderMetaDescription,
} from "@/lib/constants";

import { MissingTableQuery } from "./components/MissingTableQuery";
import { TableOrderGuestWrapper } from "./components/TableOrderGuestWrapper";

type PageParams = { storeId: string };
type Search = { table?: string | string[] };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { storeId } = await params;
  const sp = await searchParams;
  const raw = typeof sp.table === "string" ? sp.table : "";
  const table = raw.trim();
  const title = PAGE_TITLES.TABLE_ORDER;
  const description = tableOrderMetaDescription(PRODUCT.NAME);
  const path =
    table.length > 0
      ? routeStoreOrderAtTable(storeId, table)
      : `/${ROUTE_SEGMENTS.STORE}/${encodeURIComponent(storeId)}/${ROUTE_SEGMENTS.ORDER}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
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

type PageProps = Readonly<{
  params: Promise<PageParams>;
  searchParams: Promise<Search>;
}>;

export default async function StoreOrderPage({ params, searchParams }: PageProps) {
  const { storeId } = await params;
  const sp = await searchParams;
  const raw = typeof sp.table === "string" ? sp.table : "";
  const table = raw.trim();

  if (!table) {
    return <MissingTableQuery storeId={storeId} />;
  }

  return (
    <Suspense
      fallback={<PageLoading compact message="Opening menu…" />}
    >
      <TableOrderGuestWrapper storeId={storeId} tableLabel={table} />
    </Suspense>
  );
}
