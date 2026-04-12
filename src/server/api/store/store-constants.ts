import "server-only";

/** Top-level Firestore collection for tenant stores (see `.cursorrules` §6). */
export const STORES_COLLECTION = "stores" as const;

/** Menu line items under a store document (`stores/{storeId}/items/{itemId}`). */
export const STORE_ITEMS_SUBCOLLECTION = "items" as const;
