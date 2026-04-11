import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase-admin";

import { getProfileForUid } from "./get-profile";

const PROFILES_COLLECTION = "profiles";

const patchBodySchema = z
  .object({
    displayName: z.union([z.string().max(120), z.literal("")]).optional(),
    age: z.union([z.number().int().min(1).max(130), z.null()]).optional(),
  })
  .strict();

export type PatchProfileResult =
  | { ok: true; profile: Awaited<ReturnType<typeof getProfileForUid>> }
  | { ok: false; status: number; message: string };

/** Rejects attempts to change email or phone via the API body. */
export async function patchProfileForUid(
  uid: string,
  body: unknown,
): Promise<PatchProfileResult> {
  if (body !== null && typeof body === "object") {
    const forbidden = ["email", "phoneNumber", "phone", "password"] as const;
    for (const key of forbidden) {
      if (key in body) {
        return {
          ok: false,
          status: 400,
          message: `${key} cannot be updated from this form.`,
        };
      }
    }
  }

  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input.";
    return { ok: false, status: 400, message: msg };
  }

  const { displayName, age } = parsed.data;
  if (displayName === undefined && age === undefined) {
    return { ok: false, status: 400, message: "No updatable fields provided." };
  }

  const auth = getFirebaseAdminAuth();

  if (displayName !== undefined) {
    const trimmed = displayName.trim();
    await auth.updateUser(uid, {
      displayName: trimmed.length > 0 ? trimmed : null,
    });
  }

  if (age !== undefined) {
    try {
      const ref = getFirebaseAdminFirestore()
        .collection(PROFILES_COLLECTION)
        .doc(uid);
      if (age === null) {
        await ref.set(
          { age: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp() },
          { merge: true },
        );
      } else {
        await ref.set(
          { age, updatedAt: FieldValue.serverTimestamp() },
          { merge: true },
        );
      }
    } catch {
      return {
        ok: false,
        status: 503,
        message:
          "Could not save profile extras. Enable Cloud Firestore in your Firebase project.",
      };
    }
  }

  const profile = await getProfileForUid(uid);
  return { ok: true, profile };
}
