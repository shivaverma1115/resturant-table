"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChefHat,
  MapPin,
  Package,
} from "lucide-react";

import type { GuestOrderTrackResponse } from "@/features/guest-order-track/types";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS, routeStoreOrderAtTable } from "@/lib/constants";
import { cn } from "@/lib/cn";

type OrderTrackingViewProps = Readonly<{
  storeId: string;
  orderId: string;
  notifySecret: string;
}>;

const TIMELINE_STEPS = [
  { label: "Confirmed", short: "1" },
  { label: "Preparing", short: "2" },
  { label: "Quality check", short: "3" },
  { label: "In transit", short: "4" },
  { label: "Delivered", short: "5" },
] as const;

function formatMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

function activeStepIndex(status: GuestOrderTrackResponse["status"]): number {
  if (status === ORDER_STATUS.PENDING) return 0;
  if (status === ORDER_STATUS.PREPARING) return 1;
  return 4;
}

function statusHeadline(status: GuestOrderTrackResponse["status"]): string {
  if (status === ORDER_STATUS.PENDING) return "Your order was received!";
  if (status === ORDER_STATUS.PREPARING) return "Your order is being prepared!";
  return "Your order is ready!";
}

function statusBadgeText(status: GuestOrderTrackResponse["status"]): string {
  if (status === ORDER_STATUS.PENDING) return "RECEIVED";
  if (status === ORDER_STATUS.PREPARING) return "PREPARING";
  return "COMPLETED";
}

export function OrderTrackingView({
  storeId,
  orderId,
  notifySecret,
}: OrderTrackingViewProps) {
  const [data, setData] = useState<GuestOrderTrackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sid = encodeURIComponent(storeId.trim());
  const oid = encodeURIComponent(orderId.trim());

  const load = useCallback(
    async (isPoll: boolean) => {
      try {
        const q = new URLSearchParams({ secret: notifySecret });
        const res = await fetch(
          `/api/stores/${sid}/public/orders/${oid}?${q.toString()}`,
        );
        const j: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            j &&
            typeof j === "object" &&
            "error" in j &&
            typeof (j as { error: unknown }).error === "string"
              ? (j as { error: string }).error
              : "Could not load order.";
          if (!isPoll) {
            setError(msg);
            setData(null);
          }
          return;
        }
        setData(j as GuestOrderTrackResponse);
        setError(null);
      } catch (e: unknown) {
        if (!isPoll) {
          setError(e instanceof Error ? e.message : "Could not load order.");
          setData(null);
        }
      } finally {
        if (!isPoll) setLoading(false);
      }
    },
    [notifySecret, oid, sid],
  );

  useEffect(() => {
    void load(false);
    const t = window.setInterval(() => void load(true), 12_000);
    return () => window.clearInterval(t);
  }, [load]);

  const activeIdx = useMemo(
    () => (data ? activeStepIndex(data.status) : 0),
    [data],
  );

  const [itemsOpen, setItemsOpen] = useState(false);

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-muted">
        Loading your order…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <p className="text-lg font-semibold text-foreground">Order tracking</p>
        <p className="text-sm text-destructive">{error ?? "Order not found."}</p>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    );
  }

  const backToMenu = routeStoreOrderAtTable(data.storeId, data.tableLabel);
  const itemCount = data.lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className="min-h-dvh bg-zinc-100 pb-12 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href={backToMenu} aria-label="Back to menu">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-base font-semibold text-foreground sm:text-lg">
            Order tracking
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          {/* Hero */}
          <div className="relative aspect-[16/10] max-h-[14rem] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-950/50 dark:via-zinc-900 dark:to-rose-950/40">
            <div
              className="absolute inset-0 opacity-[0.15] dark:opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-5 pt-12 text-center">
              <p className="text-lg font-semibold leading-snug text-white drop-shadow sm:text-xl">
                {statusHeadline(data.status)}
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Order number
                </p>
                <p className="mt-1 font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  ORDER #{data.orderId.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                Status: {statusBadgeText(data.status)}
              </span>
            </div>

            <div className="grid gap-4 border-y border-zinc-100 py-5 dark:border-zinc-800 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Est. ready
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Ask the venue
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Items
                </p>
                <button
                  type="button"
                  className="mt-1 text-left text-sm font-medium text-foreground"
                  onClick={() => setItemsOpen((o) => !o)}
                >
                  {itemCount}{" "}
                  <span className="text-emerald-600 underline decoration-emerald-600/40 underline-offset-2 hover:text-emerald-700 dark:text-emerald-400">
                    ({itemsOpen ? "hide" : "view"} details)
                  </span>
                </button>
              </div>
              <div className="sm:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Table / area
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                  {data.tableLabel}
                </p>
              </div>
            </div>

            {itemsOpen ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Package className="size-4 opacity-70" aria-hidden />
                  Your items
                </p>
                <ul className="space-y-2 text-sm">
                  {data.lines.map((l) => (
                    <li
                      key={`${l.itemId}-${l.name}`}
                      className="flex justify-between gap-3 border-b border-zinc-200/80 py-2 last:border-0 dark:border-zinc-800"
                    >
                      <span className="text-foreground">
                        <span className="tabular-nums text-muted">{l.quantity}×</span>{" "}
                        {l.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-muted">
                        {formatMoney(l.lineTotalCents)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-zinc-200 pt-3 text-right text-sm font-semibold tabular-nums text-foreground dark:border-zinc-800">
                  Total {formatMoney(data.totalCents)}
                </p>
              </div>
            ) : null}

            {/* Timeline */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
                Progress
              </p>
              <div className="relative px-1">
                <div
                  className="absolute left-0 right-0 top-[15px] h-0.5 bg-zinc-200 dark:bg-zinc-700"
                  aria-hidden
                />
                <div
                  className="absolute left-0 top-[15px] h-0.5 bg-orange-500 transition-all duration-500 dark:bg-orange-400"
                  style={{
                    width: `${(activeIdx / (TIMELINE_STEPS.length - 1)) * 100}%`,
                    maxWidth: "100%",
                  }}
                  aria-hidden
                />
                <ol className="relative flex justify-between">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const done = idx < activeIdx;
                    const active = idx === activeIdx;
                    return (
                      <li
                        key={step.label}
                        className="flex max-w-[4.5rem] flex-col items-center text-center"
                      >
                        <div
                          className={cn(
                            "relative z-[1] flex size-8 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors sm:size-9 sm:text-xs",
                            done &&
                              "border-orange-500 bg-orange-500 text-white dark:border-orange-400 dark:bg-orange-500",
                            active &&
                              "size-10 border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30 dark:border-orange-400 dark:bg-orange-500 sm:size-11",
                            !done &&
                              !active &&
                              "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500",
                          )}
                        >
                          {done ? (
                            <Check className="size-4 sm:size-5" strokeWidth={3} />
                          ) : active && idx === 1 ? (
                            <ChefHat className="size-4 sm:size-5" />
                          ) : (
                            step.short
                          )}
                        </div>
                        <span
                          className={cn(
                            "mt-2 text-[10px] font-medium leading-tight text-muted sm:text-[11px]",
                            active && "font-semibold text-foreground",
                          )}
                        >
                          {step.short}. {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {data.createdAt ? (
              <p className="text-center text-xs text-muted">
                Placed {new Date(data.createdAt).toLocaleString()}
              </p>
            ) : null}

            <Button className="w-full" variant="outline" asChild>
              <Link href={backToMenu}>Back to menu</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
