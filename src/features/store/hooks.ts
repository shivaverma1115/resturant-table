"use client";

import { useCallback, useEffect, useState } from "react";

import * as storeApi from "./api";
import type { StoreDto, StoreListResponse } from "./types";

type AsyncStatus = "idle" | "loading" | "success" | "error";

export function useStoresList(limit?: number, cursor?: string | null) {
  const [data, setData] = useState<StoreListResponse | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await storeApi.fetchStoresList(limit, cursor ?? null);
      setData(res);
      setStatus("success");
    } catch (e: unknown) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Failed to load stores.");
    }
  }, [limit, cursor]);

  useEffect(() => {
    void Promise.resolve().then(() => refresh());
  }, [refresh]);

  return { data, status, errorMessage, refresh };
}

export function useCreateStore() {
  const [pending, setPending] = useState(false);
  const create = useCallback(
    async (input: { name: string; publicNote?: string | null }) => {
      setPending(true);
      try {
        return await storeApi.createStore(input);
      } finally {
        setPending(false);
      }
    },
    [],
  );
  return { create, pending };
}

export function usePatchStore() {
  const [pending, setPending] = useState(false);
  const patch = useCallback(
    async (
      storeId: string,
      input: { name?: string; publicNote?: string | null },
    ) => {
      setPending(true);
      try {
        return await storeApi.patchStore(storeId, input);
      } finally {
        setPending(false);
      }
    },
    [],
  );
  return { patch, pending };
}

export function useDeleteStore() {
  const [pending, setPending] = useState(false);
  const remove = useCallback(async (storeId: string) => {
    setPending(true);
    try {
      await storeApi.deleteStore(storeId);
    } finally {
      setPending(false);
    }
  }, []);
  return { remove, pending };
}

export function useStoreDetail(storeId: string | null) {
  const [store, setStore] = useState<StoreDto | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!storeId?.trim()) {
      setStore(null);
      setStatus("idle");
      setErrorMessage(null);
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    try {
      const s = await storeApi.fetchStore(storeId.trim());
      setStore(s);
      setStatus("success");
    } catch (e: unknown) {
      setStore(null);
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Failed to load store.");
    }
  }, [storeId]);

  useEffect(() => {
    void Promise.resolve().then(() => refresh());
  }, [refresh]);

  return { store, status, errorMessage, refresh };
}
