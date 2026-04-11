import Link from "next/link";

import { SCAFFOLD_NAV_LINKS } from "@/lib/constants";

export function HomeMenuView() {
  return (
    <div className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div>
        <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          Menu
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Scaffold routes (remove this block when navigation ships).
        </p>
      </div>
      <nav aria-label="Scaffold routes" className="flex flex-col gap-2">
        {SCAFFOLD_NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
