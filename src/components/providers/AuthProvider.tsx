"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getFirebaseClientAuth } from "@/lib/firebase-client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  /**
   * Whether the httpOnly session cookie (see `@/lib/cookies`) is accepted by `/api/auth/me`.
   * `null` until the first check finishes (avoid flashing the wrong UI).
   */
  httpSession: boolean | null;
  /** `true` when Firebase web config exists (client SDK may be used). */
  firebaseWebReady: boolean;
  /** Re-run the server session check (e.g. after email/password success on `/signup`). */
  refreshHttpSession: () => Promise<void>;
  /** Clear local knowledge of the cookie after sign-out (no network round-trip). */
  clearHttpSession: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  httpSession: null,
  firebaseWebReady: false,
  refreshHttpSession: async () => { },
  clearHttpSession: () => { },
});

type AuthProviderProps = Readonly<{
  children: ReactNode;
  /** `true` when `getFirebaseWebClientConfig()` succeeded on the server. */
  firebaseWebReady: boolean;
}>;

type AuthState = Readonly<{
  user: User | null;
  loading: boolean;
  httpSession: boolean | null;
}>;

export function AuthProvider({
  children,
  firebaseWebReady,
}: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    user: null,
    loading: firebaseWebReady,
    httpSession: null,
  }));

  const refreshHttpSession = useCallback(async () => {
    const next = await fetchHttpSessionStatus();
    if (next === undefined) return;
    setAuth((prev) => ({ ...prev, httpSession: next }));
  }, []);

  const clearHttpSession = useCallback(() => {
    setAuth((prev) => ({ ...prev, httpSession: false }));
  }, []);

  useEffect(() => {
    if (!firebaseWebReady) {
      setAuth((prev) => ({ ...prev, loading: false }));
      return;
    }
    let unsub: (() => void) | undefined;
    try {
      const authClient = getFirebaseClientAuth();
      unsub = onAuthStateChanged(authClient, (u) => {
        setAuth((prev) => ({ ...prev, user: u, loading: false }));
      });
    } catch {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
    return () => unsub?.();
  }, [firebaseWebReady]);

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      const next = await fetchHttpSessionStatus(ac.signal);
      if (next === undefined) return;
      setAuth((prev) => ({ ...prev, httpSession: next }));
    })();
    return () => ac.abort();
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      loading: auth.loading,
      httpSession: auth.httpSession,
      firebaseWebReady,
      refreshHttpSession,
      clearHttpSession,
    }),
    [auth, firebaseWebReady, refreshHttpSession, clearHttpSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthUser(): AuthContextValue {
  return useContext(AuthContext);
}

async function fetchHttpSessionStatus(
  signal?: AbortSignal,
): Promise<boolean | undefined> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    });
    if (signal?.aborted) return undefined;

    const data = (await res.json()) as { authenticated?: boolean };
    if (signal?.aborted) return undefined;

    if (res.status === 200 && res.ok && data.authenticated === true) {
      return true;
    }
    return false;
  } catch {
    if (signal?.aborted) return undefined;
    return false;
  }
}
