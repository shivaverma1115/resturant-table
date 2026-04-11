"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { useEffect, useRef } from "react";

import type { FirebaseWebClientConfig } from "@/config/config";

/**
 * Initializes the Firebase **web** app once on the client using config
 * resolved on the server from `.env` (`NEXT_PUBLIC_FIREBASE_*`).
 * Renders nothing; keep it above `AuthProvider` in the layout.
 */
export function FirebaseConfigBridge({
  config,
}: Readonly<{ config: FirebaseWebClientConfig | null }>) {
  const didInit = useRef(false);

  useEffect(() => {
    if (!config || didInit.current) return;
    if (getApps().length > 0) {
      didInit.current = true;
      return;
    }
    initializeApp(config);
    didInit.current = true;
  }, [config]);

  return null;
}

/** For advanced use: default app after bridge ran (client-only). */
export function getFirebaseClientAppOrNull(): FirebaseApp | null {
  const apps = getApps();
  return apps[0] ?? null;
}
