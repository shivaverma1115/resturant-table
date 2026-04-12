import Link from "next/link";

import type { StoreDto } from "@/features/store/types";
import { routeDashboardStoreSettings } from "@/lib/constants";

type StoreSettingsChooserViewProps = Readonly<{
  stores: readonly StoreDto[];
}>;

export function StoreSettingsChooserView({
  stores,
}: StoreSettingsChooserViewProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Store settings
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          You have more than one store. Choose which one to edit.
        </p>
      </header>
      <ul className="space-y-2 rounded-2xl border border-border bg-background p-4 shadow-theme-sm sm:p-6">
        {stores.map((s) => (
          <li key={s.id}>
            <Link
              href={routeDashboardStoreSettings(s.id)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
            >
              <span>{s.name}</span>
              <span className="text-xs text-muted">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
