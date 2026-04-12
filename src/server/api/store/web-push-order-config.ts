import "server-only";

/** Public + private VAPID key pair (generate once with `npx web-push generate-vapid-keys`). */
export function isWebPushConfiguredForServer(): boolean {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const priv = process.env.VAPID_PRIVATE_KEY?.trim();
  return Boolean(pub && priv);
}

export function getVapidSubject(): string {
  return (
    process.env.VAPID_SUBJECT?.trim() ||
    "mailto:orders@example.com"
  );
}
