"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useMemo } from "react";

import { StoreMenuItemCard } from "@/components/shared/StoreMenuItemCard";
import { Button } from "@/components/ui/button";
import { PublicOrderSummaryCard } from "@/features/public-store/components/common/PublicOrderSummaryCard";
import {
  PUBLIC_STORE_DEMO_ITEMS,
  formatMoneyFromCents,
} from "@/features/public-store/lib/demo-store-items";
import {
  storeCartPath,
  storeItemDetailsPath,
} from "@/features/public-store/lib/public-store-paths";
import { usePublicStoreSession } from "@/features/public-store/state/PublicStoreSessionProvider";

type StoreItemsPageProps = Readonly<{
  storeSlug: string;
}>;

export function StoreItemsPage({ storeSlug }: StoreItemsPageProps) {
  const { quantities, changeItemQuantity } = usePublicStoreSession();

  const totals = useMemo(() => {
    let itemCount = 0;
    let totalCents = 0;
    for (const item of PUBLIC_STORE_DEMO_ITEMS) {
      const qty = quantities[item.id] ?? 0;
      if (qty > 0) {
        itemCount += qty;
        totalCents += qty * item.priceCents;
      }
    }
    return { itemCount, totalCents };
  }, [quantities]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-[#05090f] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Public menu</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100 sm:text-4xl">
          Items for {storeSlug}
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          UI preview: customers can adjust quantities before placing an order.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PUBLIC_STORE_DEMO_ITEMS.map((item) => {
          const qty = quantities[item.id] ?? 0;
          return (
            <StoreMenuItemCard
              key={item.id}
              name={item.name}
              cuisineLine={item.description}
              locationLine={item.location}
              priceLabel={formatMoneyFromCents(item.priceCents)}
              isAvailable={item.isAvailable}
              footer={
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="inline-flex items-center rounded-md border border-zinc-700">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={qty === 0}
                      onClick={() => changeItemQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus />
                    </Button>
                    <span className="min-w-8 px-2 text-center text-sm font-semibold text-foreground">
                      {qty}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={!item.isAvailable}
                      onClick={() => changeItemQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!item.isAvailable}
                    onClick={() => changeItemQuantity(item.id, 1)}
                  >
                    Add
                  </Button>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link href={storeItemDetailsPath(storeSlug, item.id)}>
                      Details
                    </Link>
                  </Button>
                </div>
              }
            />
          );
        })}
      </section>

      <PublicOrderSummaryCard
        itemCount={totals.itemCount}
        totalLabel={formatMoneyFromCents(totals.totalCents)}
        ctaLabel="Open cart (UI only)"
        ctaHref={storeCartPath(storeSlug)}
      />
    </div>
  );
}
