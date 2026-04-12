import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PRODUCT, ROUTES, routeDashboardStoreSettings } from "@/lib/constants";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { listStoresForOwner } from "@/server/api/store/list-stores-for-owner";

import { CreateStoreButton } from "../components/CreateStoreButton";
import { StoreSettingsChooserView } from "./components/StoreSettingsChooserView";

export const metadata: Metadata = {
  title: "Store settings",
  description: `Choose or create a store to manage on ${PRODUCT.NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Store settings | ${PRODUCT.NAME}`,
    url: ROUTES.DASHBOARD_STORE_SETTINGS,
  },
};

export default async function StoreSettingsEntryPage() {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Store settings
          </h1>
          <p className="text-sm text-muted">
            You need to be signed in to manage store settings.
          </p>
        </header>
        <Link
          href={ROUTES.HOME}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Home
        </Link>
      </div>
    );
  }

  const list = await listStoresForOwner(session.uid, null, 50);
  if (!list.ok) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Store settings
          </h1>
        </header>
        <p className="text-sm text-destructive">{list.message}</p>
        <Link
          href={ROUTES.DASHBOARD_STORES}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to stores
        </Link>
      </div>
    );
  }

  if (list.stores.length === 1) {
    redirect(routeDashboardStoreSettings(list.stores[0].id));
  }

  if (list.stores.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Store settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You do not have a store yet. Create one to set the name and guest
            note; data is stored in Firestore under{" "}
            <code className="rounded bg-surface-subtle px-1 py-0.5 text-xs">
              stores/{`{storeId}`}
            </code>
            .
          </p>
        </header>
        <CreateStoreButton label="Create my first store" />
      </div>
    );
  }

  return <StoreSettingsChooserView stores={list.stores} />;
}
