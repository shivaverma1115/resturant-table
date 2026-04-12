type TableOrderViewProps = Readonly<{
  storeName: string;
  tableId: string;
  publicNote?: string | null;
  /**
   * `preview` — dashboard sample with owner banner.
   * `preview_embedded` — same content, no banner (used inside richer preview shells).
   */
  variant?: "default" | "preview" | "preview_embedded";
}>;

export function TableOrderView({
  storeName,
  tableId,
  publicNote,
  variant = "default",
}: TableOrderViewProps) {
  return (
    <div className="space-y-4 p-6">
      {variant === "preview" ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
          Owner preview — guests see the same layout only after the store is set
          to live.
        </p>
      ) : null}
      <div>
        <p className="text-sm font-medium text-foreground">{storeName}</p>
        <p className="mt-1 text-xs text-muted">
          Table <code className="rounded bg-surface-subtle px-1">{tableId}</code>{" "}
          — wire menu + cart (store/table from URL).
        </p>
      </div>
      {publicNote?.trim() ? (
        <p className="text-sm text-muted">{publicNote.trim()}</p>
      ) : null}
    </div>
  );
}
