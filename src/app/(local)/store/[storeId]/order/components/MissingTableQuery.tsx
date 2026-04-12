import Link from "next/link";

import { ROUTES } from "@/lib/constants";

type MissingTableQueryProps = Readonly<{
  storeId: string;
}>;

export function MissingTableQuery({ storeId }: MissingTableQueryProps) {
  return (
    <div className="mx-auto max-w-md space-y-4 p-8 text-center">
      <h1 className="text-lg font-semibold text-foreground">Table not specified</h1>
      <p className="text-sm text-muted">
        This link is missing the <code className="rounded bg-surface-subtle px-1">table</code>{" "}
        query (for example{" "}
        <code className="rounded bg-surface-subtle px-1 text-xs">?table=12-A</code>). Ask the
        venue for a valid QR code or link.
      </p>
      <p className="text-xs text-muted">
        Store id: <code className="rounded bg-surface-subtle px-1">{storeId}</code>
      </p>
      <Link
        href={ROUTES.HOME}
        className="inline-block text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
      >
        Home
      </Link>
    </div>
  );
}
