import type { OrderStatus } from "@/lib/constants";

export type GuestOrderTrackLineDto = Readonly<{
  itemId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}>;

export type GuestOrderTrackResponse = Readonly<{
  orderId: string;
  storeId: string;
  storeName: string;
  tableLabel: string;
  status: OrderStatus;
  lines: GuestOrderTrackLineDto[];
  totalCents: number;
  createdAt: number;
}>;
