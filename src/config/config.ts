/**
 * Firebase env read from **`.env`** (`NEXT_PUBLIC_*` for the web app; `FIREBASE_ADMIN_*` for Admin SDK).
 * Do not call `initializeApp` here — that runs only on the client via `FirebaseConfigBridge`.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

/** Shape safe to pass from Server Components → client `initializeApp`. */
export type FirebaseWebClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  /** Firebase Realtime Database URL (Console → Realtime Database). Enables live orders. */
  databaseURL?: string;
};

/** `null` if required `NEXT_PUBLIC_FIREBASE_*` values are missing. */
export function getFirebaseWebClientConfig(): FirebaseWebClientConfig | null {
  const c = firebaseConfig;
  const apiKey = typeof c.apiKey === "string" ? c.apiKey.trim() : "";
  const authDomain = typeof c.authDomain === "string" ? c.authDomain.trim() : "";
  const projectId = typeof c.projectId === "string" ? c.projectId.trim() : "";
  const storageBucket = typeof c.storageBucket === "string" ? c.storageBucket.trim() : "";
  const messagingSenderId = typeof c.messagingSenderId === "string" ? c.messagingSenderId.trim() : "";
  const appId = typeof c.appId === "string" ? c.appId.trim() : "";

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null;
  }

  const out: FirebaseWebClientConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
  const mid = typeof c.measurementId === "string" ? c.measurementId.trim() : "";
  if (mid) out.measurementId = mid;

  const dbUrlRaw = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  const dbUrl = typeof dbUrlRaw === "string" ? dbUrlRaw.trim() : "";
  if (dbUrl) out.databaseURL = dbUrl;

  return out;
}

/**
 * Realtime Database URL for Admin SDK and browser listeners.
 * Set `NEXT_PUBLIC_FIREBASE_DATABASE_URL` (and optionally `FIREBASE_DATABASE_URL` on the server)
 * to the URL shown in Firebase Console → Realtime Database after you create a database instance.
 */
export function getFirebaseRealtimeDatabaseUrl(): string | null {
  const explicit =
    process.env.FIREBASE_DATABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim();
  return explicit || null;
}

export function isFirebaseRealtimeDatabaseConfigured(): boolean {
  return getFirebaseRealtimeDatabaseUrl() !== null;
}

/** Web API key (Identity Toolkit / REST). */
export function getFirebaseWebApiKey(): string | undefined {
  const k = firebaseConfig.apiKey;
  return typeof k === "string" && k.trim() ? k.trim() : undefined;
}

/** Firebase project id from public config. */
export function getFirebaseWebProjectId(): string | undefined {
  const p = firebaseConfig.projectId;
  return typeof p === "string" && p.trim() ? p.trim() : undefined;
}
