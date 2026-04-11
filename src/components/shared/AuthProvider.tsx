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
   * Whether the httpOnly session cookie is accepted by `/api/auth/me`.
   * `null` until the first check finishes (avoid flashing the wrong UI).
   */
  httpSession: boolean | null;
  /** Re-run the server session check (e.g. after email/password success on `/signup`). */
  refreshHttpSession: () => Promise<void>;
  /** Clear local knowledge of the cookie after sign-out (no network round-trip). */
  clearHttpSession: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  httpSession: null,
  refreshHttpSession: async () => {},
  clearHttpSession: () => {},
});

type AuthProviderProps = Readonly<{
  children: ReactNode;
  /** `true` when `getFirebaseWebClientConfig()` succeeded on the server. */
  firebaseWebReady: boolean;
}>;

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

export function AuthProvider({
  children,
  firebaseWebReady,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => firebaseWebReady);
  const [httpSession, setHttpSession] = useState<boolean | null>(null);

  const refreshHttpSession = useCallback(async () => {
    const next = await fetchHttpSessionStatus();
    if (next === undefined) return;
    setHttpSession(next);
  }, []);

  const clearHttpSession = useCallback(() => {
    setHttpSession(false);
  }, []);

  useEffect(() => {
    if (!firebaseWebReady) {
      setLoading(false);
      return;
    }
    let unsub: (() => void) | undefined;
    try {
      const auth = getFirebaseClientAuth();
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => unsub?.();
  }, [firebaseWebReady]);

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      const next = await fetchHttpSessionStatus(ac.signal);
      if (next === undefined) return;
      setHttpSession(next);
    })();
    return () => ac.abort();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      httpSession,
      refreshHttpSession,
      clearHttpSession,
    }),
    [user, loading, httpSession, refreshHttpSession, clearHttpSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthUser(): AuthContextValue {
  return useContext(AuthContext);
}
