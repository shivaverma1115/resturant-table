"use client";

import { getApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/** Use only after `<FirebaseConfigBridge />` has run in the layout. */
export function getFirebaseClientAuth(): Auth {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase is not initialized yet. Ensure FirebaseConfigBridge is rendered with a valid config.",
    );
  }
  return getAuth(getApp());
}

/** Firebase Storage — requires `storageBucket` in web config. */
export function getFirebaseClientStorage(): FirebaseStorage {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase is not initialized yet. Ensure FirebaseConfigBridge is rendered with a valid config.",
    );
  }
  return getStorage(getApp());
}

/** Realtime Database — requires `databaseURL` in the web Firebase config. */
export function getFirebaseClientDatabase(): Database {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase is not initialized yet. Ensure FirebaseConfigBridge is rendered with a valid config.",
    );
  }
  const app = getApp();
  const url = typeof app.options.databaseURL === "string" ? app.options.databaseURL.trim() : "";
  if (!url) {
    throw new Error(
      "Firebase Realtime Database URL is missing. Set NEXT_PUBLIC_FIREBASE_DATABASE_URL in `.env` and restart the dev server.",
    );
  }
  return getDatabase(app);
}
