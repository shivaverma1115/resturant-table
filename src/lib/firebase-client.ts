"use client";

import { getApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/** Use only after `<FirebaseConfigBridge />` has run in the layout. */
export function getFirebaseClientAuth(): Auth {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase is not initialized yet. Ensure FirebaseConfigBridge is rendered with a valid config.",
    );
  }
  return getAuth(getApp());
}
