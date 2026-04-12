import Link from "next/link";

import type { StoreDto } from "@/features/store/types";
import {
  routeDashboardStoreEdit,
  routeDashboardStoreSettings,
} from "@/lib/constants";

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
          You have more than one store. Open settings (read-only) or go straight
          to the editor.
        </p>
      </header>
      <ul className="space-y-2 rounded-2xl border border-border bg-background p-4 shadow-theme-sm sm:p-6">
        {stores.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-surface-subtle"
          >
            <span className="min-w-0 truncate text-sm font-medium text-foreground">
              {s.name}
            </span>
            <span className="flex shrink-0 gap-3 text-sm">
              <Link
                href={routeDashboardStoreSettings(s.id)}
                className="font-medium text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Settings
              </Link>
              <Link
                href={routeDashboardStoreEdit(s.id)}
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Edit
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
