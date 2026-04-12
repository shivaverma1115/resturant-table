import type {
  CreateStoreItemInput,
  PatchStoreItemInput,
  StoreItemDto,
  StoreItemListResponse,
} from "./types";

async function readErrorMessage(res: Response): Promise<string> {
  const body: unknown = await res.json().catch(() => ({}));
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof (body as { error: unknown }).error === "string"
  ) {
    return (body as { error: string }).error;
  }
  return `Request failed (${res.status})`;
}

export async function fetchStoreItems(
  storeId: string,
  signal?: AbortSignal,
): Promise<StoreItemDto[]> {
  const s = encodeURIComponent(storeId);
  const res = await fetch(`/api/stores/${s}/items`, {
    credentials: "include",
    ...(signal ? { signal } : {}),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as StoreItemListResponse;
  return [...data.items];
}

export async function createStoreItem(
  storeId: string,
  body: CreateStoreItemInput,
): Promise<StoreItemDto> {
  const s = encodeURIComponent(storeId);
  const res = await fetch(`/api/stores/${s}/items`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as { item: StoreItemDto };
  return data.item;
}

export async function patchStoreItem(
  storeId: string,
  itemId: string,
  body: PatchStoreItemInput,
): Promise<StoreItemDto> {
  const s = encodeURIComponent(storeId);
  const i = encodeURIComponent(itemId);
  const res = await fetch(`/api/stores/${s}/items/${i}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as { item: StoreItemDto };
  return data.item;
}

export async function deleteStoreItem(
  storeId: string,
  itemId: string,
): Promise<void> {
  const s = encodeURIComponent(storeId);
  const i = encodeURIComponent(itemId);
  const res = await fetch(`/api/stores/${s}/items/${i}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
}
