export type StoreId = string;

export type StoreDto = Readonly<{
  id: StoreId;
  ownerId: string;
  name: string;
  publicNote: string | null;
  /** When true, `coverMediaUrl` is a Firebase Storage download URL. */
  usesPaidStorage: boolean;
  coverMediaUrl: string | null;
  /**
   * On-disk or logical path when not using paid storage.
   * With `NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT`, saves as a full folder + file name.
   */
  coverMediaLocalPath: string | null;
  /** When true, public `/store/.../order?table=...` ordering works for guests. */
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type PatchStoreInput = Readonly<{
  name?: string;
  publicNote?: string | null;
  usesPaidStorage?: boolean;
  coverMediaUrl?: string | null;
  coverMediaLocalPath?: string | null;
  isLive?: boolean;
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
