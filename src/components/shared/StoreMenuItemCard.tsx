import type { ReactNode } from "react";

import { MENU_ITEM_CARD_IMAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/cn";

/** Decorative ratings row (listing-style) until you store real scores per item. */
const DEMO_DINING_RATING = "4.1";
const DEMO_DELIVERY_RATING = "3.9";

export type StoreMenuItemCardProps = Readonly<{
  name: string;
  /** Shown like “cuisine” line; truncated. */
  cuisineLine: string | null;
  /** Bottom line, e.g. area or store name. */
  locationLine: string;
  /** Formatted price, e.g. "12.50". */
  priceLabel: string;
  isAvailable: boolean;
  /** When false, shows demo dining + delivery badges (Zomato-style). */
  showDemoRatings?: boolean;
  /** Extra controls (e.g. Edit / Delete) under the text block. */
  footer?: ReactNode;
  className?: string;
}>;

export function StoreMenuItemCard({
  name,
  cuisineLine,
  locationLine,
  priceLabel,
  isAvailable,
  showDemoRatings = true,
  footer,
  className,
}: StoreMenuItemCardProps) {
  const cuisine =
    cuisineLine?.trim() ||
    "Chef’s picks, seasonal ingredients — add a description in Edit.";

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-theme-sm",
        className,
      )}
    >
      <div className="relative aspect-[5/4] w-full shrink-0 bg-zinc-100 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- external CDN demo asset */}
        <img
          src={MENU_ITEM_CARD_IMAGE_URL}
          alt=""
          className="size-full object-cover"
        />
        {!isAvailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/55">
            <span className="rounded-md bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
              Off menu
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
          {name}
        </h3>

        {showDemoRatings ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded bg-emerald-700 px-1.5 py-0.5 font-semibold text-white dark:bg-emerald-600">
                {DEMO_DINING_RATING}{" "}
                <span className="text-white" aria-hidden>
                  ★
                </span>
              </span>
              <span className="font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Dining
              </span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded bg-emerald-700 px-1.5 py-0.5 font-semibold text-white dark:bg-emerald-600">
                {DEMO_DELIVERY_RATING}{" "}
                <span className="text-white" aria-hidden>
                  ★
                </span>
              </span>
              <span className="font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                Delivery
              </span>
            </span>
          </div>
        ) : null}

        <p className="line-clamp-2 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
          {cuisine}
        </p>

        <p className="text-sm text-zinc-500 dark:text-zinc-500">{locationLine}</p>

        <p className="mt-auto border-t border-border pt-2 text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {priceLabel}
        </p>

        {footer ? <div className="flex flex-wrap gap-2 pt-1">{footer}</div> : null}
      </div>
    </article>
  );
}
