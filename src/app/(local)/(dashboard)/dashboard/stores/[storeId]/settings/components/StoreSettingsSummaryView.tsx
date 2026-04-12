import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { StoreDto } from "@/features/store/types";
import {
  ROUTES,
  routeApiStoreLocalCover,
  routeDashboardStoreEdit,
  routeDashboardStorePreview,
} from "@/lib/constants";

type StoreSettingsSummaryViewProps = Readonly<{
  storeId: string;
  store: StoreDto | null;
  error?: string | null;
}>;

function coverImageSrc(sid: string, store: StoreDto): string | null {
  if (store.coverMediaUrl?.trim()) return store.coverMediaUrl.trim();
  if (!store.usesPaidStorage && store.coverMediaLocalPath?.trim()) {
    return routeApiStoreLocalCover(sid);
  }
  return null;
}

export function StoreSettingsSummaryView({
  storeId,
  store,
  error,
}: StoreSettingsSummaryViewProps) {
  if (error) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Store settings
          </h1>
        </header>
        <p className="text-sm text-destructive">{error}</p>
        <Link
          href={ROUTES.DASHBOARD_STORES}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to stores
        </Link>
      </div>
    );
  }

  if (!store) {
    return null;
  }

  const coverSrc = coverImageSrc(storeId, store);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Store settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Read-only overview. Use{" "}
            <span className="font-medium text-foreground">Edit store</span> to
            change name, cover, visibility, or delete this store.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={routeDashboardStoreEdit(storeId)}>Edit store</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={routeDashboardStorePreview(storeId)}>Preview</Link>
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Details</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Store name
            </dt>
            <dd className="mt-1 font-medium text-foreground">{store.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Store ID
            </dt>
            <dd className="mt-1">
              <code className="rounded bg-surface-subtle px-2 py-1 text-xs">
                {store.id}
              </code>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Visibility
            </dt>
            <dd className="mt-1 text-foreground">
              {store.isLive ? "Live (public ordering)" : "Draft"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Cover media
            </dt>
            <dd className="mt-1 text-foreground">
              {store.usesPaidStorage
                ? "Firebase Storage (paid quota)"
                : "Local / logical path (no Storage upload)"}
            </dd>
          </div>
          {store.publicNote?.trim() ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Guest-facing note
              </dt>
              <dd className="mt-1 text-foreground">{store.publicNote.trim()}</dd>
            </div>
          ) : (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Guest-facing note
              </dt>
              <dd className="mt-1 text-muted">None</dd>
            </div>
          )}
          {store.coverMediaLocalPath?.trim() &&
          !store.coverMediaUrl?.trim() &&
          !store.usesPaidStorage ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Saved local path
              </dt>
              <dd className="mt-1 break-all">
                <code className="rounded bg-surface-subtle px-2 py-1 text-xs">
                  {store.coverMediaLocalPath.trim()}
                </code>
              </dd>
            </div>
          ) : null}
        </dl>

        {coverSrc ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote URL or same-origin API */}
            <img
              src={coverSrc}
              alt=""
              className="max-h-56 w-full object-cover"
            />
          </div>
        ) : null}
      </section>

      <p className="text-sm text-muted">
        <Link
          href={ROUTES.DASHBOARD_STORES}
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to all stores
        </Link>
      </p>
    </div>
  );
}
