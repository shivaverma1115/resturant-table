"use client";

import Link from "next/link";

import { useStoresList } from "@/features/store/hooks";
import {
  ROUTES,
  routeDashboardStorePreview,
  routeDashboardStoreSettings,
} from "@/lib/constants";

import { CreateStoreButton } from "./CreateStoreButton";

export function DashboardStoresView() {
  const { data, status, errorMessage, refresh } = useStoresList(10, null);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Stores
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Stores you own in Firestore (<code className="text-xs">ownerId</code>{" "}
            matches your account). Use{" "}
            <Link
              href={ROUTES.DASHBOARD_STORE_SETTINGS}
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Store settings
            </Link>{" "}
            to edit names and notes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <CreateStoreButton label="Add store" />
          <Link
            href={ROUTES.DASHBOARD}
            className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>

      {status === "loading" && (
        <p className="text-sm text-muted">Loading stores…</p>
      )}
      {status === "error" && (
        <div className="rounded-xl border border-destructive/40 bg-background p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      {status === "success" && data && data.stores.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-10 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No stores yet. Create one to get started.
          </p>
          <div className="mt-4 flex justify-center">
            <CreateStoreButton label="Create my first store" />
          </div>
        </div>
      )}
      {status === "success" && data && data.stores.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-background shadow-theme-sm">
          {data.stores.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{s.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  <span
                    className={
                      s.isLive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-500"
                    }
                  >
                    {s.isLive ? "Live" : "Draft"}
                  </span>
                  <span className="mx-1.5 text-border">·</span>
                  <code className="rounded bg-surface-subtle px-1 py-0.5">
                    {s.id}
                  </code>
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-1">
                <Link
                  href={routeDashboardStorePreview(s.id)}
                  className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
                >
                  Preview
                </Link>
                <Link
                  href={routeDashboardStoreSettings(s.id)}
                  className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Settings
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {status === "success" && data?.nextCursor && (
        <p className="text-xs text-muted">
          More stores exist than shown here — add cursor pagination to this
          view when needed.
        </p>
      )}
      {status === "success" && data && data.stores.length > 0 && (
        <p className="text-xs text-muted">
          <button
            type="button"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            onClick={() => void refresh()}
          >
            Refresh list
          </button>
        </p>
      )}
    </div>
  );
}
