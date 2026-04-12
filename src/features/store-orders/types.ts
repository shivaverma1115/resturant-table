import type { OrderStatus } from "@/lib/constants";

export type GuestOrderLineDto = Readonly<{
  itemId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}>;

export type GuestOrderSnapshotDto = Readonly<{
  id: string;
  tableLabel: string;
  status: OrderStatus;
  lines: GuestOrderLineDto[];
  totalCents: number;
  createdAt: number;
}>;
