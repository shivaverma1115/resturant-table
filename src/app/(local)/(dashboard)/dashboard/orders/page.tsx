import type { Metadata } from "next";
import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { createDashboardMetadata } from "@/features/dashboard/lib/dashboard-metadata";

export const metadata: Metadata = createDashboardMetadata({
  title: "Orders",
  description: "View and manage orders.",
  url: ROUTES.DASHBOARD_ORDERS,
});

export default function DashboardOrdersPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted">
          Live guest orders (Firebase Realtime Database) are listed per store. Open
          a store from{" "}
          <Link
            href={ROUTES.DASHBOARD_STORES}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Stores
          </Link>{" "}
          and choose <span className="font-medium text-foreground">Orders</span>{" "}
          or <span className="font-medium text-foreground">QR</span> for table
          codes.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-border bg-background/80 p-8 text-center text-sm text-muted">
        Use each store&apos;s <strong>Orders</strong> page for the realtime list.
      </div>
    </main>
  );
}
