/**
 * Application configuration — product, routing, auth cookie name, SEO.
 * Firebase env and `firebaseConfig` live in `@/config/config` (single `.env` file).
 */

/** HttpOnly Firebase session cookie (JWT from Admin `createSessionCookie`). */
export const AUTH_COOKIE = {
  SESSION_NAME: "fb_session",
} as const;

// ─── URLs & routing ─────────────────────────────────────────────────────────

export const DEFAULT_URLS = {
  LOCALHOST: "http://localhost:3000",
} as const;

export const ROUTE_SEGMENTS = {
  STORE: "store",
  TABLE: "table",
} as const;

/** App paths (route groups like `(auth)` are not part of the URL). */
export const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  DASHBOARD_STORES: "/dashboard/stores",
  DASHBOARD_STORE_SETTINGS: "/dashboard/stores/settings",
  DASHBOARD_ORDERS: "/dashboard/orders",
  DASHBOARD_PROFILE: "/dashboard/profile",
  ADMIN: "/admin",
  ADMIN_ACTIVITY: "/admin/activity",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function routeStoreTable(storeId: string, tableId: string): string {
  const s = encodeURIComponent(storeId);
  const t = encodeURIComponent(tableId);
  return `/${ROUTE_SEGMENTS.STORE}/${s}/${ROUTE_SEGMENTS.TABLE}/${t}`;
}

/** Owner dashboard: settings for a specific store document. */
export function routeDashboardStoreSettings(storeId: string): string {
  const s = encodeURIComponent(storeId);
  return `${ROUTES.DASHBOARD_STORES}/${s}/settings`;
}

/** Owner dashboard: preview guest ordering UI before going live. */
export function routeDashboardStorePreview(storeId: string): string {
  const s = encodeURIComponent(storeId);
  return `${ROUTES.DASHBOARD_STORES}/${s}/preview`;
}

/** Authenticated API: streams on-disk cover when using local (non-Storage) mode. */
export function routeApiStoreLocalCover(storeId: string): string {
  const s = encodeURIComponent(storeId);
  return `/api/stores/${s}/local-cover`;
}

// ─── Domain model (align with Firestore / rules) ───────────────────────────

export const AUTH_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STORE_OWNER: "STORE_OWNER",
  CUSTOMER: "CUSTOMER",
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  COMPLETED: "completed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ─── Product & marketing ─────────────────────────────────────────────────────

export const PRODUCT = {
  NAME: "TableOrder",
  TAGLINE: "QR menus & table ordering for restaurants",
  DESCRIPTION:
    "Let guests scan a table QR, browse your menu, and order in one flow. Owners manage stores, tables, and live orders.",
  KEYWORDS: [
    "restaurant",
    "QR menu",
    "table ordering",
    "food ordering",
    "QR code ordering",
    "hospitality",
  ] as const,
} as const;

// ─── SEO / social previews ───────────────────────────────────────────────────

export const OG = {
  LOCALE: "en_US",
  TYPE_WEBSITE: "website" as const,
} as const;

export const TWITTER = {
  CARD_SUMMARY_LARGE_IMAGE: "summary_large_image" as const,
} as const;

export const PAGE_TITLES = {
  TABLE_ORDER: "Order at table",
} as const;

export function tableOrderMetaDescription(brandName: string): string {
  return `Browse the menu and place an order for this table on ${brandName}.`;
}

/** Primary header navigation (center column). */
export const MAIN_HEADER_NAV_LINKS = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.DASHBOARD_STORES, label: "Stores" },
  { href: ROUTES.ADMIN, label: "Admin" },
  { href: ROUTES.ADMIN_ACTIVITY, label: "Activity" },
] as const;

// ─── Development / scaffold (remove when real nav exists) ───────────────────

export const SCAFFOLD_NAV_LINKS = [
  { href: ROUTES.SIGNUP, label: "Auth · Sign in / Sign up" },
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.DASHBOARD_STORES, label: "Dashboard · Stores" },
  { href: ROUTES.ADMIN, label: "Admin" },
  { href: ROUTES.ADMIN_ACTIVITY, label: "Admin · Activity" },
] as const;

// ─── Runtime URL resolution (uses process.env) ──────────────────────────────

export function resolveAppOrigin(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();
  const raw =
    fromEnv ||
    (vercel ? (vercel.startsWith("http") ? vercel : `https://${vercel}`) : null) ||
    DEFAULT_URLS.LOCALHOST;
  try {
    return new URL(raw);
  } catch {
    return new URL(DEFAULT_URLS.LOCALHOST);
  }
}

// ─── Single object read-through (optional ergonomic import) ─────────────────

export const appConfig = {
  defaults: { urls: DEFAULT_URLS },
  routing: { segments: ROUTE_SEGMENTS, paths: ROUTES },
  auth: { roles: AUTH_ROLES },
  orders: { status: ORDER_STATUS },
  product: PRODUCT,
  seo: { og: OG, twitter: TWITTER, pageTitles: PAGE_TITLES },
  dev: { scaffoldNavLinks: SCAFFOLD_NAV_LINKS },
} as const;

export const ERROR_MESSAGE_BACKEND_UNAVAILABLE = "Service temporarily unavailable. Please try again.";
export const ERROR_MESSAGE_GENERIC = "Something went wrong. Try again.";

export const SIGNUP_SUCCESS_MESSAGE = "Signed up successfully.";
export const SIGNIN_SUCCESS_MESSAGE = "Signed in successfully.";
