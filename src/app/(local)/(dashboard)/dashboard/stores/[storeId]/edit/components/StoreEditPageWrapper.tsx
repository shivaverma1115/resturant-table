import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";

import { StoreEditView } from "./StoreEditView";

export async function StoreEditPageWrapper({
  storeId,
}: Readonly<{ storeId: string }>) {
  const session = await requireSessionUid();
  if (!session.ok) {
    return (
      <StoreEditView
        storeId={storeId}
        initialStore={null}
        initialError="You need to be signed in to edit a store."
      />
    );
  }

  const result = await getStoreForOwner(session.uid, storeId);
  if (!result.ok) {
    return (
      <StoreEditView
        storeId={storeId}
        initialStore={null}
        initialError={result.message}
      />
    );
  }

  return <StoreEditView storeId={storeId} initialStore={result.store} />;
}
