import type {
  CreateStoreResponse,
  DeleteStoreResponse,
  PatchStoreInput,
  PatchStoreResponse,
  StoreDto,
  StoreListResponse,
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

export async function fetchStoresList(
  limit?: number,
  cursor?: string | null,
  signal?: AbortSignal,
): Promise<StoreListResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  const q = params.toString();
  const res = await fetch(`/api/stores${q ? `?${q}` : ""}`, {
    credentials: "include",
    ...(signal ? { signal } : {}),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as StoreListResponse;
}

export async function createStore(body: {
  name: string;
  publicNote?: string | null;
}): Promise<StoreDto> {
  const res = await fetch("/api/stores", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as CreateStoreResponse;
  return data.store;
}

export async function fetchStore(storeId: string): Promise<StoreDto> {
  const s = encodeURIComponent(storeId);
  const res = await fetch(`/api/stores/${s}`, { credentials: "include" });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return (await res.json()) as StoreDto;
}

export async function patchStore(
  storeId: string,
  body: PatchStoreInput,
): Promise<StoreDto> {
  const s = encodeURIComponent(storeId);
  const res = await fetch(`/api/stores/${s}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as PatchStoreResponse;
  return data.store;
}

export async function deleteStore(storeId: string): Promise<void> {
  const s = encodeURIComponent(storeId);
  const res = await fetch(`/api/stores/${s}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const data = (await res.json()) as DeleteStoreResponse;
  if (!data.deleted) {
    throw new Error("Delete did not complete.");
  }
}
