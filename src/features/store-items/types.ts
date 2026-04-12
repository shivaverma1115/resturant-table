export type StoreItemId = string;

export type StoreItemDto = Readonly<{
  id: StoreItemId;
  name: string;
  description: string | null;
  /** Minor units (e.g. cents). */
  priceCents: number;
  sortOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type StoreItemListResponse = Readonly<{
  items: StoreItemDto[];
}>;

export type CreateStoreItemInput = Readonly<{
  name: string;
  description?: string | null;
  priceCents: number;
  isAvailable?: boolean;
}>;

export type PatchStoreItemInput = Readonly<{
  name?: string;
  description?: string | null;
  priceCents?: number;
  sortOrder?: number;
  isAvailable?: boolean;
}>;
