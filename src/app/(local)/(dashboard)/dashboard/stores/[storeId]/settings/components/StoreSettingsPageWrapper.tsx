import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreSettingsSummaryView } from "./StoreSettingsSummaryView";

export async function StoreSettingsPageWrapper({
  storeId,
}: Readonly<{ storeId: string }>) {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <StoreSettingsSummaryView
        storeId={storeId}
        store={null}
        error="You need to be signed in to view store settings."
      />
    );
  }

  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return (
      <StoreSettingsSummaryView
        storeId={storeId}
        store={null}
        error={result.message}
      />
    );
  }

  return <StoreSettingsSummaryView storeId={storeId} store={result.store} />;
}
