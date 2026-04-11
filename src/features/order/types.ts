import { ORDER_STATUS, type OrderStatus } from "@/lib/constants";

export type { OrderStatus };

export type OrderId = string;

export const ORDER_STATUS_LIST = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.COMPLETED,
] as const satisfies readonly OrderStatus[];
