import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreSettingsView } from "./StoreSettingsView";

export async function StoreSettingsPageWrapper({
  storeId,
}: Readonly<{ storeId: string }>) {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <StoreSettingsView
        storeId={storeId}
        initialStore={null}
        initialError="You need to be signed in to manage store settings."
      />
    );
  }

  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return (
      <StoreSettingsView
        storeId={storeId}
        initialStore={null}
        initialError={result.message}
      />
    );
  }

  return (
    <StoreSettingsView storeId={storeId} initialStore={result.store} />
  );
}
