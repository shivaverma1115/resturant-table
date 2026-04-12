"use client";

import { getApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
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
