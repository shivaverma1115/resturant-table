"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getFirebaseClientStorage } from "@/lib/firebase-client";

function safeExtension(fileName: string, mime: string): string {
  const fromName = fileName.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") ?? "";
  if (fromName.length >= 2 && fromName.length <= 8) {
    return fromName.toLowerCase();
  }
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("webm")) return "webm";
  return "bin";
}

/** Uploads cover media for a store; returns the public download URL. */
export async function uploadStoreCoverMedia(
  storeId: string,
  file: File,
): Promise<string> {
  const storage = getFirebaseClientStorage();
  const ext = safeExtension(file.name, file.type);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `stores/${encodeURIComponent(storeId)}/cover/${id}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
