"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";

import type { GuestOrderSnapshotDto } from "@/features/store-orders/types";
import { ORDER_STATUS_LIST, type OrderStatus } from "@/features/order/types";
import { ORDER_STATUS } from "@/lib/constants";
import { getFirebaseClientDatabase } from "@/lib/firebase-client";
import { RTDB_STORE_ORDERS_PATH } from "@/lib/rtdb-paths";
import { Button } from "@/components/ui/button";
import {
  notifyException,
  showErrorMessage,
  showSuccessMessage,
} from "@/lib/notify";

function isOrderStatus(v: unknown): v is OrderStatus {
  return (
    typeof v === "string" && (ORDER_STATUS_LIST as readonly string[]).includes(v)
  );
}

function parseOrders(val: unknown): GuestOrderSnapshotDto[] {
  if (!val || typeof val !== "object") return [];
  const rows: GuestOrderSnapshotDto[] = [];
  for (const [id, raw] of Object.entries(val as Record<string, unknown>)) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const tableLabel =
      typeof o.tableLabel === "string" && o.tableLabel.trim()
        ? o.tableLabel.trim()
        : "—";
    const status: OrderStatus = isOrderStatus(o.status)
      ? o.status
      : ORDER_STATUS.PENDING;
    const totalCents =
      typeof o.totalCents === "number" && Number.isFinite(o.totalCents)
        ? Math.round(o.totalCents)
        : 0;
    const createdAt =
      typeof o.createdAt === "number" && Number.isFinite(o.createdAt)
        ? o.createdAt
        : 0;
    const linesRaw = o.lines;
    const lines: GuestOrderSnapshotDto["lines"] = [];
    if (Array.isArray(linesRaw)) {
      for (const line of linesRaw) {
        if (!line || typeof line !== "object") continue;
        const lr = line as Record<string, unknown>;
        const itemId = typeof lr.itemId === "string" ? lr.itemId : "";
        const name = typeof lr.name === "string" ? lr.name : "Item";
        const quantity =
          typeof lr.quantity === "number" && lr.quantity > 0
            ? Math.floor(lr.quantity)
            : 1;
        const unitPriceCents =
          typeof lr.unitPriceCents === "number" ? lr.unitPriceCents : 0;
        const lineTotalCents =
          typeof lr.lineTotalCents === "number"
            ? lr.lineTotalCents
            : unitPriceCents * quantity;
        if (itemId) {
          lines.push({
            itemId,
            name,
            quantity,
            unitPriceCents,
            lineTotalCents,
          });
        }
      }
    }
    rows.push({
      id,
      tableLabel,
      status,
      lines,
      totalCents,
      createdAt,
    });
  }
  rows.sort((a, b) => b.createdAt - a.createdAt);
  return rows;
}

function formatMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

type StoreOrdersViewProps = Readonly<{
  storeId: string;
  storeName: string;
  realtimeConfigured: boolean;
}>;

export function StoreOrdersView({
  storeId,
  storeName,
  realtimeConfigured,
}: StoreOrdersViewProps) {
  const [orders, setOrders] = useState<GuestOrderSnapshotDto[]>([]);
  const [listenError, setListenError] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);

  useEffect(() => {
    if (!realtimeConfigured) return;
    let unsub: (() => void) | undefined;
    try {
      const db = getFirebaseClientDatabase();
      const r = ref(db, `${RTDB_STORE_ORDERS_PATH}/${storeId}`);
      unsub = onValue(
        r,
        (snap) => {
          setListenError(null);
          setOrders(parseOrders(snap.val()));
        },
        (err) => {
          setListenError(err.message);
          notifyException(err, "Live orders listener failed.");
        },
      );
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Could not connect to Realtime Database.";
      setListenError(msg);
    }
    return () => {
      if (unsub) unsub();
    };
  }, [realtimeConfigured, storeId]);

  const sid = useMemo(() => encodeURIComponent(storeId), [storeId]);

  const setStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setPatchingId(orderId);
      try {
        const res = await fetch(
          `/api/stores/${sid}/orders/${encodeURIComponent(orderId)}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          },
        );
        if (!res.ok) {
          const j: unknown = await res.json().catch(() => ({}));
          const msg =
            j &&
            typeof j === "object" &&
            "error" in j &&
            typeof (j as { error: unknown }).error === "string"
              ? (j as { error: string }).error
              : "Update failed.";
          throw new Error(msg);
        }
        showSuccessMessage("Order updated.");
      } catch (e: unknown) {
        showErrorMessage(e instanceof Error ? e.message : "Update failed.");
      } finally {
        setPatchingId(null);
      }
    },
    [sid],
  );

  if (!realtimeConfigured) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
        Add <code className="rounded bg-background/60 px-1">NEXT_PUBLIC_FIREBASE_DATABASE_URL</code>{" "}
        to your <code className="rounded bg-background/60 px-1">.env</code>, create a Realtime
        Database in Firebase Console, and deploy{" "}
        <code className="rounded bg-background/60 px-1">firebase/database.rules.json</code> so
        signed-in owners can see live orders for <strong>{storeName}</strong>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Live orders — {storeName}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Updates appear instantly from the Realtime Database when guests place orders.
        </p>
      </div>

      {listenError ? (
        <p className="text-sm text-destructive">{listenError}</p>
      ) : null}

      {orders.length === 0 && !listenError ? (
        <p className="text-sm text-muted">No orders yet for this store.</p>
      ) : null}

      <ul className="space-y-4">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-border bg-background p-4 shadow-theme-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Table / area
                </p>
                <p className="text-lg font-semibold text-foreground">{o.tableLabel}</p>
                <p className="mt-1 text-xs text-muted">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : "—"}{" "}
                  · {o.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Total</p>
                <p className="text-lg font-semibold tabular-nums text-foreground">
                  {formatMoney(o.totalCents)}
                </p>
                <p className="mt-1 text-xs font-medium capitalize text-muted">{o.status}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              {o.lines.map((l) => (
                <li key={`${o.id}-${l.itemId}-${l.name}`} className="flex justify-between gap-2">
                  <span className="text-foreground">
                    {l.quantity}× {l.name}
                  </span>
                  <span className="tabular-nums text-muted">{formatMoney(l.lineTotalCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={o.status !== ORDER_STATUS.PENDING || patchingId === o.id}
                onClick={() => void setStatus(o.id, ORDER_STATUS.PREPARING)}
              >
                Preparing
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={
                  o.status === ORDER_STATUS.COMPLETED || patchingId === o.id
                }
                onClick={() => void setStatus(o.id, ORDER_STATUS.COMPLETED)}
              >
                Done
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
