import "server-only";

import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import type { ProfileResponse } from "@/lib/profile-types";

const PROFILES_COLLECTION = "profiles";

export async function getProfileForUid(uid: string): Promise<ProfileResponse> {
  const auth = getFirebaseAdminAuth();
  const record = await auth.getUser(uid);

  let age: number | null = null;
  const snap = await getFirebaseAdminFirestore()
    .collection(PROFILES_COLLECTION)
    .doc(uid)
    .get();
  if (snap.exists) {
    const raw = snap.data()?.age;
    if (typeof raw === "number" && Number.isInteger(raw) && raw >= 1 && raw <= 130) {
      age = raw;
    }
  }

  return {
    uid: record.uid,
    email: record.email ?? null,
    emailVerified: record.emailVerified,
    phoneNumber: record.phoneNumber ?? null,
    displayName: record.displayName ?? null,
    photoURL: record.photoURL ?? null,
    profile: { age },
  };
}
