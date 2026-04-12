"use client";

import { useCallback, useEffect, useState } from "react";

import * as itemsApi from "./api";
import type { StoreItemDto } from "./types";

type AsyncStatus = "idle" | "loading" | "success" | "error";

function isAbortError(e: unknown): boolean {
  return e instanceof DOMException && e.name === "AbortError";
}

export function useStoreItemsList(storeId: string | null) {
  const [items, setItems] = useState<StoreItemDto[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!storeId?.trim()) {
        setItems([]);
        setStatus("idle");
        setErrorMessage(null);
        return;
      }
      setStatus("loading");
      setErrorMessage(null);
      try {
        const list = await itemsApi.fetchStoreItems(storeId.trim(), signal);
        if (signal?.aborted) return;
        setItems(list);
        setStatus("success");
      } catch (e: unknown) {
        if (signal?.aborted || isAbortError(e)) return;
        setStatus("error");
        setErrorMessage(e instanceof Error ? e.message : "Failed to load items.");
      }
    },
    [storeId],
  );

  useEffect(() => {
    if (!storeId?.trim()) return;
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [storeId, load]);

  const refresh = useCallback(() => {
    void load();
  }, [load]);

  return { items, status, errorMessage, refresh };
}
