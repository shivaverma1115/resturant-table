import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export function DashboardStoresView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Stores
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            List and edit stores you own (`ownerId` in Firestore).
          </p>
        </div>
        <Link
          href={ROUTES.DASHBOARD}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
        <p>Replace with a paginated table + “Add store” when Firestore is wired.</p>
      </div>
    </div>
  );
}
