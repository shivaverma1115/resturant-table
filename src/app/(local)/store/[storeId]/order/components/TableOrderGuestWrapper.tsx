import { getStoreForPublicOrder } from "@/server/api/store/get-store-for-public-order";

import { StoreMissingView } from "../../table/[tableId]/components/StoreMissingView";
import { StoreNotLiveView } from "../../table/[tableId]/components/StoreNotLiveView";
import { GuestOrderExperience } from "./GuestOrderExperience";

type TableOrderGuestWrapperProps = Readonly<{
  storeId: string;
  tableLabel: string;
}>;

export async function TableOrderGuestWrapper({
  storeId,
  tableLabel,
}: TableOrderGuestWrapperProps) {
  const result = await getStoreForPublicOrder(storeId);
  if (!result.ok) {
    return <StoreMissingView />;
  }
  if (!result.isLive) {
    return <StoreNotLiveView />;
  }
  return (
    <GuestOrderExperience
      storeId={storeId}
      tableLabel={tableLabel}
      storeName={result.name}
      publicNote={result.publicNote}
    />
  );
}
