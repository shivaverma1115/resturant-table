import Link from "next/link";

import { AUTH_ROLES, ROUTES } from "@/lib/constants";

export function AdminHomeView() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
          Super admin
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Platform overview
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {`Restrict with middleware + custom claims (${AUTH_ROLES.SUPER_ADMIN} only).`}
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={ROUTES.ADMIN_ACTIVITY}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-amber-700"
        >
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
            Activity
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Audit-style feed (placeholder).
          </p>
        </Link>
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-700 dark:bg-zinc-950/40">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
            Users & stores
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Cross-tenant queries only in trusted server paths.
          </p>
        </div>
      </div>
    </div>
  );
}
