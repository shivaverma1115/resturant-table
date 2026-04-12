import "server-only";

import path from "node:path";

const LOCAL_PREFIX = "local/cover/";

export type ValidateCoverLocalPathResult =
  | { ok: true; absoluteFilePath: string; storedPath: string }
  | { ok: false; message: string };

/**
 * Resolves a persisted cover path to a readable absolute file path when
 * `NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT` is set and the value is allowed.
 */
export function validateCoverMediaLocalPath(
  input: string,
): ValidateCoverLocalPathResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, message: "Cover path is empty." };
  }

  const root = process.env.NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT?.trim();

  if (trimmed.startsWith(LOCAL_PREFIX)) {
    const rel = trimmed.slice(LOCAL_PREFIX.length).replace(/\\/g, "/");
    if (!rel || rel.includes("..") || rel.startsWith("/")) {
      return { ok: false, message: "Invalid local/cover path." };
    }
    if (!root) {
      return { ok: true, absoluteFilePath: "", storedPath: trimmed };
    }
    const abs = path.resolve(path.join(root, rel));
    const rootResolved = path.resolve(root);
    const relCheck = path.relative(rootResolved, abs);
    if (relCheck.startsWith("..") || path.isAbsolute(relCheck)) {
      return { ok: false, message: "Cover path escapes media root." };
    }
    return { ok: true, absoluteFilePath: abs, storedPath: trimmed };
  }

  if (!root) {
    return {
      ok: false,
      message:
        "Set NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT in .env.local to your image folder (same path you use on disk), then restart the dev server.",
    };
  }

  let abs: string;
  try {
    abs = path.resolve(trimmed);
  } catch {
    return { ok: false, message: "Invalid cover path." };
  }

  const rootResolved = path.resolve(root);
  const rel = path.relative(rootResolved, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return {
      ok: false,
      message:
        "Cover path must be inside NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT (use the folder where the file actually lives).",
    };
  }

  return { ok: true, absoluteFilePath: abs, storedPath: trimmed };
}

export function getAbsoluteCoverFilePath(
  localPath: string | null | undefined,
): string | null {
  if (!localPath?.trim()) return null;
  const v = validateCoverMediaLocalPath(localPath);
  if (!v.ok || !v.absoluteFilePath) return null;
  return v.absoluteFilePath;
}
