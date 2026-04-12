/** File name only (no folders); avoids path traversal in composed paths. */
function safeCoverFileName(fileName: string): string {
  const base = fileName.trim().split(/[/\\]/).pop() ?? "";
  const safe = base
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
  return safe.length > 0 ? safe : "upload.bin";
}

/**
 * Path persisted on the store when not using Firebase Storage.
 * If `NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT` is set (e.g. `D:\...\dummy profile pics`),
 * the value is that folder plus the safe file name so it matches a real file on disk.
 * Otherwise falls back to `local/cover/…` (logical only; preview needs the env + API route).
 */
export function buildLocalCoverPath(fileName: string): string {
  const safe = safeCoverFileName(fileName);
  const root =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT?.trim()
      : undefined;
  if (!root) {
    return `local/cover/${safe}`;
  }
  const normalizedRoot = root.replace(/[/\\]+$/, "");
  const isWin = /^[A-Za-z]:/.test(normalizedRoot);
  const sep = isWin ? "\\" : "/";
  return `${normalizedRoot}${sep}${safe}`;
}
