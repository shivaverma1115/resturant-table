import Link from "next/link";

import { ROUTES } from "@/lib/constants";

export function AdminActivityView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Super admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Activity
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Placeholder for audits, signups, and critical events.
          </p>
        </div>
        <Link
          href={ROUTES.ADMIN}
          className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          ← Admin home
        </Link>
      </div>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60">
        {[
          "No events yet — connect Cloud Functions logging or Firestore audit writes.",
        ].map((line) => (
          <li
            key={line}
            className="px-4 py-4 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
