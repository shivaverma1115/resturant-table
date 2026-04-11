import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { getFirebaseWebProjectId } from "@/config/config";

let app: App | undefined;
let firestore: Firestore | undefined;

function stripOuterQuotesAndBom(raw: string): string {
  let s = raw.trim();
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function normalizeFirebaseAdminPrivateKey(raw: string): string {
  let key = stripOuterQuotesAndBom(raw);
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return key.trim();
}

type ParsedServiceAccount = {
  project_id?: string;
  private_key?: string;
  client_email?: string;
};

function tryParseServiceAccountJson(text: string): ParsedServiceAccount | null {
  const t = stripOuterQuotesAndBom(text);
  if (!t.startsWith("{")) return null;
  try {
    return JSON.parse(t) as ParsedServiceAccount;
  } catch {
    return null;
  }
}

type LoadedAdminCreds = {
  projectId?: string;
  clientEmail: string;
  privateKey: string;
};

export function loadFirebaseAdminCredentialsFromEnv(): LoadedAdminCreds | null {
  const jsonEnv =
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON?.trim() ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonEnv) {
    const sa = tryParseServiceAccountJson(jsonEnv);
    if (sa?.private_key && sa.client_email) {
      return {
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: normalizeFirebaseAdminPrivateKey(sa.private_key),
      };
    }
  }

  const keyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const emailEnv = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();

  if (keyRaw?.trim()) {
    const saFromKey = tryParseServiceAccountJson(keyRaw);
    if (saFromKey?.private_key && saFromKey.client_email) {
      return {
        projectId: saFromKey.project_id,
        clientEmail: saFromKey.client_email,
        privateKey: normalizeFirebaseAdminPrivateKey(saFromKey.private_key),
      };
    }
  }

  if (!emailEnv || !keyRaw?.trim()) return null;

  return {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID?.trim(),
    clientEmail: emailEnv,
    privateKey: normalizeFirebaseAdminPrivateKey(keyRaw),
  };
}

/** Path to service account JSON (Windows-friendly) or metadata / gcloud. */
function hasGoogleApplicationCredentials(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());
}

export function isFirebaseAdminConfigured(): boolean {
  if (loadFirebaseAdminCredentialsFromEnv() !== null) return true;
  return hasGoogleApplicationCredentials();
}

function resolveAdminProjectId(cred: LoadedAdminCreds | null): string {
  const pid =
    cred?.projectId?.trim() ||
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.GCLOUD_PROJECT?.trim() ||
    getFirebaseWebProjectId();
  if (!pid?.trim()) {
    throw new Error(
      "Firebase Admin needs a project id. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_PROJECT_ID, or GCLOUD_PROJECT (or use service account JSON with project_id).",
    );
  }
  return pid.trim();
}

export function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  if (app) return app;

  const cred = loadFirebaseAdminCredentialsFromEnv();

  try {
    if (cred) {
      const pid = resolveAdminProjectId(cred);
      app = initializeApp({
        projectId: pid,
        credential: cert({
          projectId: pid,
          clientEmail: cred.clientEmail,
          privateKey: cred.privateKey,
        }),
      });
      return app;
    }

    if (hasGoogleApplicationCredentials()) {
      const pid = resolveAdminProjectId(null);
      app = initializeApp({
        projectId: pid,
        credential: applicationDefault(),
      });
      return app;
    }
  } catch (e) {
    app = undefined;
    throw e;
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON (or FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY), or set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file.",
  );
}

export function getFirebaseAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseAdminApp());
  }
  return firestore;
}
