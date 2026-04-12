export type MediaKind = "image" | "video";

export type MediaUploadMode = "local" | "cloud";

/** Value stored in React Hook Form for a media field. */
export type MediaFieldValue = Readonly<{
  /** Preview (`blob:`) or hosted `https:` URL from cloud mode */
  url: string;
  mimeType: string;
  kind: MediaKind;
  /** Original or cropped file — omit after successful cloud upload if you only keep `url`. */
  file?: File;
}>;

export type MediaUploadResult = MediaFieldValue;

export type CloudUploadHandler = (
  file: File,
  meta: Readonly<{ mimeType: string; kind: MediaKind }>,
) => Promise<string>;

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}
