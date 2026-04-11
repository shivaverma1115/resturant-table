import type { Metadata } from "next";

import { PRODUCT, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Orders",
  description: `View and manage orders on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Orders | ${PRODUCT.NAME}`,
    url: ROUTES.DASHBOARD_ORDERS,
  },
};

export default function DashboardOrdersPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted">
          Live and past orders across your stores—connect Firestore listeners and
          filters here.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-border bg-background/80 p-8 text-center text-sm text-muted">
        Order list and filters will appear here.
      </div>
    </main>
  );
}
