export type StoreId = string;

export type StoreDto = Readonly<{
  id: StoreId;
  ownerId: string;
  name: string;
  publicNote: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type StoreListResponse = Readonly<{
  stores: StoreDto[];
  nextCursor: string | null;
}>;

export type CreateStoreResponse = Readonly<{
  store: StoreDto;
}>;

export type PatchStoreResponse = Readonly<{
  store: StoreDto;
}>;

export type DeleteStoreResponse = Readonly<{
  deleted: true;
}>;
