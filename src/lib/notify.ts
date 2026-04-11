import { toast } from "sonner";

/** Success toast — pass any user-facing message string. */
export function showSuccessMessage(message: string): void {
  toast.success(message);
}

/** Error toast — pass any user-facing message string. */
export function showErrorMessage(message: string): void {
  toast.error(message);
}

/** Neutral / info toast. */
export function showInfoMessage(message: string): void {
  toast.message(message);
}

/** Warning toast. */
export function showWarningMessage(message: string): void {
  toast.warning(message);
}

/**
 * Central place for user-visible feedback (Sonner toasts).
 * Prefer the `show*Message` functions for new code; `notify` kept for compatibility.
 */
export const notify = {
  success: showSuccessMessage,
  error: showErrorMessage,
  info: showInfoMessage,
  warning: showWarningMessage,
} as const;

/** Prefer `error` from JSON `{ error?: string }`; fall back to status text. */
export function messageFromApiBody(body: unknown, status: number): string {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof (body as { error: unknown }).error === "string"
  ) {
    return (body as { error: string }).error;
  }
  return `Request failed (${status})`;
}

/** Parse JSON from a failed `Response` and show an error toast. */
export async function notifyFailedResponse(res: Response): Promise<void> {
  const body = await res.json().catch(() => ({}));
  showErrorMessage(messageFromApiBody(body, res.status));
}

/** `Error` message, or optional fallback for non-Error throws. */
export function notifyException(
  err: unknown,
  fallback = "Something went wrong.",
): void {
  const message = err instanceof Error ? err.message : fallback;
  showErrorMessage(message);
}
