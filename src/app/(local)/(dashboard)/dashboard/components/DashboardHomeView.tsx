import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export function DashboardHomeView() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Overview for your stores and live orders (wire TanStack Query + Firestore).
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={ROUTES.DASHBOARD_STORES}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-emerald-700"
        >
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
            Stores
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage locations, menus, and tables.
          </p>
        </Link>
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-700 dark:bg-zinc-950/40">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
            Live orders
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Add a bounded Firestore listener scoped per store.
          </p>
        </div>
      </div>
    </div>
  );
}
