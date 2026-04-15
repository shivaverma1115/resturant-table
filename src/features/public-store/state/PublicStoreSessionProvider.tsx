"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartQuantities = Record<string, number>;

type PublicStoreSessionContextValue = Readonly<{
  storeSlug: string;
  hydrated: boolean;
  testModeEnabled: boolean;
  toggleTestMode: () => void;
  quantities: CartQuantities;
  setItemQuantity: (itemId: string, quantity: number) => void;
  changeItemQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartItemCount: number;
}>;

const PublicStoreSessionContext = createContext<PublicStoreSessionContextValue | null>(
  null,
);

type SessionSnapshot = Readonly<{
  testModeEnabled: boolean;
  quantities: CartQuantities;
}>;

const DEFAULT_SNAPSHOT: SessionSnapshot = {
  testModeEnabled: false,
  quantities: {},
};

function storageKeyForStore(storeSlug: string): string {
  return `public-store-session:${storeSlug}`;
}

export function PublicStoreSessionProvider({
  storeSlug,
  children,
}: Readonly<{ storeSlug: string; children: React.ReactNode }>) {
  const [snapshot, setSnapshot] = useState<SessionSnapshot>(DEFAULT_SNAPSHOT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKeyForStore(storeSlug));
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<SessionSnapshot>;
      setSnapshot({
        testModeEnabled: Boolean(parsed.testModeEnabled),
        quantities:
          parsed.quantities && typeof parsed.quantities === "object"
            ? parsed.quantities
            : {},
      });
    } catch {
      setSnapshot(DEFAULT_SNAPSHOT);
    } finally {
      setHydrated(true);
    }
  }, [storeSlug]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeyForStore(storeSlug), JSON.stringify(snapshot));
  }, [hydrated, snapshot, storeSlug]);

  const setItemQuantity = useCallback((itemId: string, quantity: number) => {
    setSnapshot((prev) => {
      const next = Math.max(0, quantity);
      const clone = { ...prev.quantities };
      if (next === 0) {
        delete clone[itemId];
      } else {
        clone[itemId] = next;
      }
      return { ...prev, quantities: clone };
    });
  }, []);

  const changeItemQuantity = useCallback(
    (itemId: string, delta: number) => {
      setSnapshot((prev) => {
        const current = prev.quantities[itemId] ?? 0;
        const next = Math.max(0, current + delta);
        const clone = { ...prev.quantities };
        if (next === 0) {
          delete clone[itemId];
        } else {
          clone[itemId] = next;
        }
        return { ...prev, quantities: clone };
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, quantities: {} }));
  }, []);

  const toggleTestMode = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, testModeEnabled: !prev.testModeEnabled }));
  }, []);

  const cartItemCount = useMemo(
    () => Object.values(snapshot.quantities).reduce((sum, qty) => sum + qty, 0),
    [snapshot.quantities],
  );

  const value = useMemo<PublicStoreSessionContextValue>(
    () => ({
      storeSlug,
      hydrated,
      testModeEnabled: snapshot.testModeEnabled,
      toggleTestMode,
      quantities: snapshot.quantities,
      setItemQuantity,
      changeItemQuantity,
      clearCart,
      cartItemCount,
    }),
    [
      storeSlug,
      hydrated,
      snapshot,
      toggleTestMode,
      setItemQuantity,
      changeItemQuantity,
      clearCart,
      cartItemCount,
    ],
  );

  return (
    <PublicStoreSessionContext.Provider value={value}>
      {children}
    </PublicStoreSessionContext.Provider>
  );
}

export function usePublicStoreSession(): PublicStoreSessionContextValue {
  const context = useContext(PublicStoreSessionContext);
  if (!context) {
    throw new Error("usePublicStoreSession must be used within PublicStoreSessionProvider");
  }
  return context;
}
