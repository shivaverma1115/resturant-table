import { getStoreForPublicOrder } from "@/server/api/store/get-store-for-public-order";

import { StoreMissingView } from "./StoreMissingView";
import { StoreNotLiveView } from "./StoreNotLiveView";
import { TableOrderView } from "./TableOrderView";

type TableOrderWrapperProps = Readonly<{
  storeId: string;
  tableId: string;
}>;

export async function TableOrderWrapper({
  storeId,
  tableId,
}: TableOrderWrapperProps) {
  const result = await getStoreForPublicOrder(storeId);
  if (!result.ok) {
    return <StoreMissingView />;
  }
  if (!result.isLive) {
    return <StoreNotLiveView />;
  }
  return (
    <TableOrderView
      storeName={result.name}
      tableId={tableId}
      publicNote={result.publicNote}
      variant="default"
    />
  );
}
