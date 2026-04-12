/** Owner uid per store — written only by Admin SDK; used in RTDB security rules. */
export const RTDB_STORE_OWNER_INDEX_PATH = "rtdbIndex/storeOwners" as const;

/** Live guest orders keyed by store, then Firebase push id. */
export const RTDB_STORE_ORDERS_PATH = "storeOrders" as const;

/**
 * Browser Web Push subscriptions for guests who opt in after placing an order.
 * `orderWebPushSubscriptions/{storeId}/{orderId}/{subscriptionId}` — Admin SDK only.
 */
export const RTDB_ORDER_WEB_PUSH_SUBSCRIPTIONS_PATH =
  "orderWebPushSubscriptions" as const;
