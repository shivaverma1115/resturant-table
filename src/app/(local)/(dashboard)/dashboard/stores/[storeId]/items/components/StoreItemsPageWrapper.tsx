import Link from "next/link";

import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreItemsView } from "./StoreItemsView";

export async function StoreItemsPageWrapper({
  storeId,
}: Readonly<{ storeId: string }>) {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <p className="text-sm text-muted">
        You need to be signed in to manage menu items.
      </p>
    );
  }

  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{result.message}</p>
        <Link
          href="/dashboard/stores"
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to stores
        </Link>
      </div>
    );
  }

  return (
    <StoreItemsView storeId={result.store.id} storeName={result.store.name} />
  );
}
