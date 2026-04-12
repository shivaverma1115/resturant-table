"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Images,
  LayoutGrid,
  MapPin,
  MessageSquareText,
  Share2,
  UtensilsCrossed,
} from "lucide-react";

import { TableOrderView } from "@/app/(local)/store/[storeId]/table/[tableId]/components/TableOrderView";
import { StoreMenuItemCard } from "@/components/shared/StoreMenuItemCard";
import { Button } from "@/components/ui/button";
import { useStoreItemsList } from "@/features/store-items/hooks";
import type { StoreItemDto } from "@/features/store-items/types";
import type { StoreDto } from "@/features/store/types";
import {
  PRODUCT,
  ROUTES,
  routeApiStoreLocalCover,
  routeDashboardStoreEdit,
  routeDashboardStoreItems,
  routeStoreTable,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

type StorePreviewViewProps = Readonly<{
  store: StoreDto;
}>;

type PreviewTab = "overview" | "order" | "menu" | "photos";

const AMENITY_ROWS = [
  "QR ordering at the table",
  "Guest menu preview",
  "Draft / live visibility control",
  "Public note on guest screen",
  "Cover image or video (optional)",
  "Menu line items (name, price, availability)",
] as const;

function TabButton({
  tabId,
  label,
  icon: Icon,
  active,
  onSelect,
}: Readonly<{
  tabId: PreviewTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  onSelect: (id: PreviewTab) => void;
}>) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(tabId)}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
        active
          ? "border-[var(--color-accent)] text-foreground"
          : "border-transparent text-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
      {label}
    </button>
  );
}

function formatItemPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

type MenuFetchStatus = "idle" | "loading" | "success" | "error";

function PreviewMenuContent({
  storeId,
  storeName,
  menuItems,
  menuStatus,
  menuError,
}: Readonly<{
  storeId: string;
  storeName: string;
  menuItems: StoreItemDto[];
  menuStatus: MenuFetchStatus;
  menuError: string | null;
}>) {
  const loading = menuStatus === "idle" || menuStatus === "loading";
  const showGrid = menuStatus === "success" && menuItems.length > 0;

  return (
    <>
      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading menu…</p>
      ) : null}
      {menuStatus === "error" && menuError ? (
        <p className="mt-6 text-sm text-destructive">{menuError}</p>
      ) : null}
      {menuStatus === "success" && menuItems.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          No items yet.{" "}
          <Link
            href={routeDashboardStoreItems(storeId)}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Add menu items
          </Link>
          .
        </p>
      ) : null}
      {showGrid ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((it) => (
            <StoreMenuItemCard
              key={it.id}
              name={it.name}
              cuisineLine={it.description}
              locationLine={storeName}
              priceLabel={formatItemPrice(it.priceCents)}
              isAvailable={it.isAvailable}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

export function StorePreviewView({ store }: StorePreviewViewProps) {
  const previewTableId = "preview";
  const guestUrl = routeStoreTable(store.id, previewTableId);
  const [tab, setTab] = useState<PreviewTab>("overview");
  const { items: menuItems, status: menuStatus, errorMessage: menuError } =
    useStoreItemsList(store.id);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const coverSrc = useMemo(
    () =>
      store.coverMediaUrl?.trim() ??
      (!store.usesPaidStorage && store.coverMediaLocalPath?.trim()
        ? routeApiStoreLocalCover(store.id)
        : null),
    [
      store.coverMediaUrl,
      store.coverMediaLocalPath,
      store.usesPaidStorage,
      store.id,
    ],
  );

  const copyGuestLink = useCallback(async () => {
    const full = `${window.location.origin}${guestUrl}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [guestUrl]);

  const shareGuestLink = useCallback(async () => {
    const full = `${window.location.origin}${guestUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: store.name, url: full });
      } else {
        await copyGuestLink();
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }, [copyGuestLink, guestUrl, store.name]);

  return (
    <div className="min-w-0 space-y-6 pb-16">
      <div className="rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-2.5 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100 sm:text-sm">
        <strong className="font-semibold">Owner preview</strong> — layout mimics
        a public restaurant listing; only you see this page from the dashboard.
      </div>

      <div className="mx-auto max-w-6xl min-w-0 space-y-4">
        <nav
          className="flex flex-wrap items-center gap-1 text-xs text-muted sm:text-sm"
          aria-label="Breadcrumb"
        >
          <Link
            href={ROUTES.DASHBOARD}
            className="hover:text-foreground hover:underline"
          >
            Dashboard
          </Link>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
          <Link
            href={ROUTES.DASHBOARD_STORES}
            className="hover:text-foreground hover:underline"
          >
            Stores
          </Link>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="font-medium text-foreground">Preview</span>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="truncate text-foreground">{store.name}</span>
        </nav>

        {/* Hero gallery (Zomato-style collage; extra tiles are placeholders until multi-photo exists) */}
        <div className="overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-theme-md">
          <div className="grid aspect-[16/9] max-h-[min(52vw,20rem)] grid-cols-4 grid-rows-2 gap-0.5 sm:max-h-[22rem] sm:gap-1">
            <div className="relative col-span-2 row-span-2 bg-zinc-900/5 dark:bg-zinc-950/40">
              {coverSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob, Storage, or same-origin API
                <img
                  src={coverSrc}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center text-muted">
                  <Images className="size-10 opacity-40" aria-hidden />
                  <p className="text-sm">
                    Add a cover under{" "}
                    <Link
                      href={routeDashboardStoreEdit(store.id)}
                      className="font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
                    >
                      Edit store
                    </Link>{" "}
                    to fill this hero.
                  </p>
                </div>
              )}
            </div>
            <div
              className="hidden bg-gradient-to-br from-rose-100/90 to-amber-50/80 sm:block dark:from-rose-950/50 dark:to-amber-950/30"
              aria-hidden
            />
            <div
              className="hidden bg-gradient-to-br from-emerald-100/80 to-teal-50/70 sm:block dark:from-emerald-950/40 dark:to-teal-950/25"
              aria-hidden
            />
            <div
              className="hidden bg-gradient-to-br from-violet-100/80 to-zinc-100/90 sm:col-start-4 sm:row-span-2 sm:block dark:from-violet-950/35 dark:to-zinc-900/40"
              aria-hidden
            />
            <div
              className="hidden bg-gradient-to-br from-orange-50 to-rose-50 sm:col-start-3 sm:row-start-2 sm:block dark:from-orange-950/25 dark:to-rose-950/20"
              aria-hidden
            />
          </div>
        </div>

        {/* Title strip */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {store.name}
            </h1>
            <p className="text-sm text-muted">
              {PRODUCT.NAME} · Table ordering · QR guest link
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-xs font-medium text-foreground">
                {store.isLive ? "Live for guests" : "Draft — QR shows not live"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                <span className="text-amber-600 dark:text-amber-400">★</span>
                Preview listing
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={routeDashboardStoreEdit(store.id)}>Edit store</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void copyGuestLink()}
            >
              {copied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy guest link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void shareGuestLink()}
            >
              <Share2 className="size-4" aria-hidden />
              Share
            </Button>
          </div>
        </div>

        {/* Quick actions row (icon-style like Zomato) */}
        <div className="flex flex-wrap gap-3 border-b border-border pb-4 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-muted">
            <MapPin className="size-3.5 text-[var(--color-accent)]" aria-hidden />
            Address — add in catalog later
          </span>
          <a
            href={guestUrl}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-muted hover:bg-surface-subtle hover:text-foreground"
          >
            <UtensilsCrossed className="size-3.5" aria-hidden />
            Open guest path
          </a>
        </div>

        {/* Tabs */}
        <div
          className="-mx-1 flex gap-4 overflow-x-auto border-b border-border px-1"
          role="tablist"
          aria-label="Store sections"
        >
          <TabButton
            tabId="overview"
            label="Overview"
            icon={LayoutGrid}
            active={tab === "overview"}
            onSelect={setTab}
          />
          <TabButton
            tabId="order"
            label="Order at table"
            icon={UtensilsCrossed}
            active={tab === "order"}
            onSelect={setTab}
          />
          <TabButton
            tabId="menu"
            label="Menu"
            icon={MessageSquareText}
            active={tab === "menu"}
            onSelect={setTab}
          />
          <TabButton
            tabId="photos"
            label="Photos"
            icon={Images}
            active={tab === "photos"}
            onSelect={setTab}
          />
        </div>

        {/* Tab panels */}
        <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,20rem)] lg:items-start">
          <div className="min-w-0 space-y-8">
            {tab === "overview" ? (
              <>
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Dining highlights
                  </h2>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {[
                      "Fast table checkout",
                      "Owner preview before go-live",
                      "Optional Firebase cover media",
                    ].map((title) => (
                      <div
                        key={title}
                        className="min-w-[10.5rem] shrink-0 rounded-xl border border-border bg-gradient-to-br from-background to-surface-subtle p-4 shadow-theme-sm"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Placeholder card — replace with real promos when wired.
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Menu
                      </h2>
                      <p className="mt-1 text-xs text-muted">
                        Everything you add under Manage items shows here on
                        Overview and on the Menu tab.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={routeDashboardStoreItems(store.id)}>
                        Manage items
                      </Link>
                    </Button>
                  </div>
                  <PreviewMenuContent
                    storeId={store.id}
                    storeName={store.name}
                    menuItems={menuItems}
                    menuStatus={menuStatus}
                    menuError={menuError}
                  />
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    About this listing
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {store.publicNote?.trim() ??
                      "No guest-facing note yet. Add one under Edit store to show how you’d like diners to order (e.g. “Order here — we bring it to your table”)."}
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    What’s enabled
                  </h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {AMENITY_ROWS.map((row) => (
                      <li
                        key={row}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        {row}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}

            {tab === "order" ? (
              <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-theme-sm">
                <div className="border-b border-border bg-surface-subtle/60 px-4 py-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    Guest ordering screen
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Sample table{" "}
                    <code className="rounded bg-background px-1 py-0.5 font-mono text-[11px]">
                      {previewTableId}
                    </code>
                    — same shell guests see at the QR URL.
                  </p>
                </div>
                <TableOrderView
                  storeName={store.name}
                  tableId={previewTableId}
                  publicNote={store.publicNote}
                  variant="preview_embedded"
                />
              </section>
            ) : null}

            {tab === "menu" ? (
              <section className="rounded-2xl border border-border bg-background p-6 shadow-theme-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                    <p className="mt-1 text-xs text-muted">
                      Same data guests will see once the guest menu is wired to
                      this list.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={routeDashboardStoreItems(store.id)}>
                      Manage items
                    </Link>
                  </Button>
                </div>
                <PreviewMenuContent
                  storeId={store.id}
                  storeName={store.name}
                  menuItems={menuItems}
                  menuStatus={menuStatus}
                  menuError={menuError}
                />
              </section>
            ) : null}

            {tab === "photos" ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Photos</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                    {coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverSrc}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted">
                        No cover yet
                      </div>
                    )}
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-xl border border-dashed border-border bg-gradient-to-br from-muted/80 to-surface-subtle"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-xs text-muted">
                  Extra tiles are placeholders until a multi-image gallery is
                  stored on the store.
                </p>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-theme-sm">
              <div className="bg-gradient-to-r from-violet-600/90 to-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white">
                Guest QR link
              </div>
              <div className="space-y-3 p-4">
                <p className="text-xs text-muted">
                  When the store is live, guests open this path (or scan a QR that
                  encodes it).
                </p>
                <code className="block break-all rounded-lg bg-surface-subtle px-3 py-2 text-[11px] leading-relaxed text-foreground">
                  {origin ? `${origin}${guestUrl}` : guestUrl}
                </code>
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={() => void copyGuestLink()}
                >
                  {copied ? "Copied to clipboard" : "Copy full URL"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-theme-sm">
              <h3 className="text-sm font-semibold text-foreground">Map</h3>
              <p className="mt-2 text-xs text-muted">
                A map and directions block would sit here once you store an
                address and coordinates on the store.
              </p>
              <div className="mt-3 flex aspect-[16/10] items-center justify-center rounded-xl bg-muted/60 text-xs text-muted">
                Map placeholder
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 text-xs text-muted shadow-theme-sm">
              <p>
                Inspired by listing-style restaurant pages — your data today:
                name, note, cover, live flag. Extend the store model to fill
                cuisine, hours, and reviews.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
