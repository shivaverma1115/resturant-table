import { routeStoreTable } from "@/lib/constants";

/**
 * QR payload must resolve to the public ordering route (`/store/.../order?table=...`).
 * @deprecated Prefer importing `routeStoreTable` from `@/lib/constants` directly.
 */
export function tableOrderPath(storeId: string, tableId: string): string {
  return routeStoreTable(storeId, tableId);
}
