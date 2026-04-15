"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicOrderSummaryCard } from "@/features/public-store/components/common/PublicOrderSummaryCard";
import {
  PUBLIC_STORE_DEMO_ITEMS,
  formatMoneyFromCents,
} from "@/features/public-store/lib/demo-store-items";
import {
  storeItemsPath,
  storeOrderSuccessPath,
} from "@/features/public-store/lib/public-store-paths";
import { usePublicStoreSession } from "@/features/public-store/state/PublicStoreSessionProvider";

type StoreCartPageProps = Readonly<{
  storeSlug: string;
}>;

export function StoreCartPage({ storeSlug }: StoreCartPageProps) {
  const { quantities, setItemQuantity } = usePublicStoreSession();

  const selectedRows = useMemo(() => {
    return PUBLIC_STORE_DEMO_ITEMS.filter((item) => (quantities[item.id] ?? 0) > 0).map(
      (item) => ({
        ...item,
        qty: quantities[item.id] ?? 0,
      }),
    );
  }, [quantities]);

  const summary = useMemo(() => {
    const subtotalCents = selectedRows.reduce(
      (sum, row) => sum + row.qty * row.priceCents,
      0,
    );
    const serviceCents = selectedRows.length > 0 ? 99 : 0;
    const totalCents = subtotalCents + serviceCents;
    const itemCount = selectedRows.reduce((sum, row) => sum + row.qty, 0);
    return { subtotalCents, serviceCents, totalCents, itemCount };
  }, [selectedRows]);

  function updateQty(itemId: string, delta: number) {
    const next = Math.max(0, (quantities[itemId] ?? 0) + delta);
    setItemQuantity(itemId, next);
  }

  function removeItem(itemId: string) {
    setItemQuantity(itemId, 0);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-[#05090f] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Cart</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-100 sm:text-4xl">
          Your order for {storeSlug}
        </h1>
      </section>

      {selectedRows.length === 0 ? (
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-center">
          <p className="text-sm text-zinc-300">Your cart is empty.</p>
          <Button className="mt-3" variant="secondary" size="sm" asChild>
            <Link href={storeItemsPath(storeSlug)}>Browse items</Link>
          </Button>
        </section>
      ) : (
        <>
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5">
            {selectedRows.map((row) => (
              <article
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
              >
                <div>
                  <p className="font-medium text-zinc-100">{row.name}</p>
                  <p className="text-xs text-zinc-400">{formatMoneyFromCents(row.priceCents)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-md border border-zinc-700">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => updateQty(row.id, -1)}>
                      <Minus />
                    </Button>
                    <span className="min-w-8 px-2 text-center text-sm font-semibold text-zinc-100">
                      {row.qty}
                    </span>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => updateQty(row.id, 1)}>
                      <Plus />
                    </Button>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => removeItem(row.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 lg:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-100">Guest details</h2>
              <div className="space-y-1.5">
                <Label htmlFor="guest-name">Name</Label>
                <Input id="guest-name" placeholder="Enter your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest-phone">Phone</Label>
                <Input id="guest-phone" placeholder="Enter your phone" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest-note">Order note</Label>
                <Textarea id="guest-note" placeholder="Optional note for kitchen" />
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/35 p-4">
              <h3 className="text-base font-semibold text-zinc-100">Bill details</h3>
              <p className="flex items-center justify-between text-sm text-zinc-300">
                <span>Subtotal</span>
                <span>{formatMoneyFromCents(summary.subtotalCents)}</span>
              </p>
              <p className="flex items-center justify-between text-sm text-zinc-300">
                <span>Service fee</span>
                <span>{formatMoneyFromCents(summary.serviceCents)}</span>
              </p>
              <p className="flex items-center justify-between border-t border-zinc-800 pt-2 text-sm font-semibold text-zinc-100">
                <span>Total</span>
                <span>{formatMoneyFromCents(summary.totalCents)}</span>
              </p>
            </div>
          </section>
        </>
      )}

      <PublicOrderSummaryCard
        itemCount={summary.itemCount}
        totalLabel={formatMoneyFromCents(summary.totalCents)}
        ctaLabel="Place order (UI only)"
        ctaHref={storeOrderSuccessPath(storeSlug)}
        ctaDisabled={summary.itemCount === 0}
        note="This is a UI-only checkout flow."
      />
    </div>
  );
}
