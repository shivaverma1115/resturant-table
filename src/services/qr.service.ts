import { routeStoreTable } from "@/lib/constants";

/**
 * QR payload must resolve to the public ordering route (see .cursorrules).
 * @deprecated Prefer importing `routeStoreTable` from `@/lib/config` directly.
 */
export function tableOrderPath(storeId: string, tableId: string): string {
  return routeStoreTable(storeId, tableId);
}
