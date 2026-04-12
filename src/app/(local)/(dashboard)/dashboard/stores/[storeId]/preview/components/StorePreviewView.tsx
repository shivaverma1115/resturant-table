import Link from "next/link";

import { TableOrderView } from "@/app/(local)/store/[storeId]/table/[tableId]/components/TableOrderView";
import { Button } from "@/components/ui/button";
import type { StoreDto } from "@/features/store/types";
import {
  routeApiStoreLocalCover,
  routeDashboardStoreSettings,
  routeStoreTable,
} from "@/lib/constants";

type StorePreviewViewProps = Readonly<{
  store: StoreDto;
}>;

export function StorePreviewView({ store }: StorePreviewViewProps) {
  const previewTableId = "preview";
  const guestUrl = routeStoreTable(store.id, previewTableId);

  const coverSrc =
    store.coverMediaUrl?.trim() ??
    (!store.usesPaidStorage && store.coverMediaLocalPath?.trim()
      ? routeApiStoreLocalCover(store.id)
      : null);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
        <strong className="font-semibold">Owner preview.</strong> This page is
        only visible from your dashboard. Guests use the QR link after you set the
        store to{" "}
        <span className="font-medium">live</span> in settings.
      </div>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {store.name}
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href={routeDashboardStoreSettings(store.id)}>
              ← Store settings
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted">
          Status:{" "}
          <span className="font-medium text-foreground">
            {store.isLive ? "Live for guests" : "Draft (QR link shows “not live”)"}
          </span>
        </p>
        {store.publicNote?.trim() ? (
          <p className="text-sm text-muted">{store.publicNote.trim()}</p>
        ) : null}
      </header>

      {coverSrc ? (
        <div className="overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- Storage URL or same-origin local-cover API */}
          <img src={coverSrc} alt="" className="max-h-56 w-full object-cover" />
        </div>
      ) : null}

      <section className="rounded-2xl border border-border bg-background shadow-theme-sm">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Guest ordering screen (sample table)
          </h2>
          <p className="mt-1 text-xs text-muted">
            Public URL when live:{" "}
            <code className="rounded bg-surface-subtle px-1 py-0.5 text-[11px]">
              {guestUrl}
            </code>
          </p>
        </div>
        <TableOrderView
          storeName={store.name}
          tableId={previewTableId}
          publicNote={store.publicNote}
          variant="preview"
        />
      </section>
    </div>
  );
}
