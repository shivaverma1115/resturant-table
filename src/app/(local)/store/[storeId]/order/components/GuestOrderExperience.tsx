"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StoreItemDto } from "@/features/store-items/types";
import { urlBase64ToUint8Array } from "@/features/order-push/url-base64-to-uint8array";
import { cn } from "@/lib/cn";
import { MENU_ITEM_CARD_IMAGE_URL, routeStoreOrderTrack } from "@/lib/constants";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/lib/notify";

type GuestOrderExperienceProps = Readonly<{
  storeId: string;
  tableLabel: string;
  storeName: string;
  publicNote?: string | null;
}>;

function formatMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

type LoadState = "idle" | "loading" | "error" | "ready";

const vapidPublic =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() ?? ""
    : "";

export function GuestOrderExperience({
  storeId,
  tableLabel,
  storeName,
  publicNote,
}: GuestOrderExperienceProps) {
  const [items, setItems] = useState<StoreItemDto[]>([]);
  const [load, setLoad] = useState<LoadState>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedNotifySecret, setPlacedNotifySecret] = useState<string | null>(null);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [notifyBusy, setNotifyBusy] = useState(false);

  const sid = encodeURIComponent(storeId.trim());
  const guestUserId = encodeURIComponent(tableLabel.trim() || "guest");

  useEffect(() => {
    const ac = new AbortController();
    setLoad("loading");
    setLoadError(null);
    void (async () => {
      try {
        const res = await fetch(`/api/stores/${sid}/public/items`, {
          signal: ac.signal,
        });
        if (!res.ok) {
          const j: unknown = await res.json().catch(() => ({}));
          const msg =
            j &&
            typeof j === "object" &&
            "error" in j &&
            typeof (j as { error: unknown }).error === "string"
              ? (j as { error: string }).error
              : "Could not load menu.";
          throw new Error(msg);
        }
        const data = (await res.json()) as { items: StoreItemDto[] };
        if (ac.signal.aborted) return;
        setItems(data.items ?? []);
        setLoad("ready");
      } catch (e: unknown) {
        if (ac.signal.aborted) return;
        setLoad("error");
        setLoadError(e instanceof Error ? e.message : "Could not load menu.");
      }
    })();
    return () => ac.abort();
  }, [sid]);

  const cartLines = useMemo(() => {
    const lines: { item: StoreItemDto; qty: number }[] = [];
    for (const it of items) {
      const q = qtyById[it.id] ?? 0;
      if (q > 0) lines.push({ item: it, qty: q });
    }
    return lines;
  }, [items, qtyById]);

  const cartTotalCents = useMemo(
    () => cartLines.reduce((s, l) => s + l.item.priceCents * l.qty, 0),
    [cartLines],
  );

  const bump = useCallback((itemId: string, delta: number) => {
    setQtyById((prev) => {
      const cur = prev[itemId] ?? 0;
      const next = Math.min(99, Math.max(0, cur + delta));
      const copy = { ...prev };
      if (next <= 0) delete copy[itemId];
      else copy[itemId] = next;
      return copy;
    });
  }, []);

  const placeOrder = useCallback(async () => {
    if (cartLines.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/stores/${sid}/public/items/${guestUserId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableLabel,
          lines: cartLines.map((l) => ({
            itemId: l.item.id,
            quantity: l.qty,
          })),
        }),
      });
      const j: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          j &&
          typeof j === "object" &&
          "error" in j &&
          typeof (j as { error: unknown }).error === "string"
            ? (j as { error: string }).error
            : "Order failed.";
        throw new Error(msg);
      }
      const id =
        j &&
        typeof j === "object" &&
        "orderId" in j &&
        typeof (j as { orderId: unknown }).orderId === "string"
          ? (j as { orderId: string }).orderId
          : null;
      const secret =
        j &&
        typeof j === "object" &&
        "notifySecret" in j &&
        typeof (j as { notifySecret: unknown }).notifySecret === "string"
          ? (j as { notifySecret: string }).notifySecret
          : null;
      setPlacedOrderId(id);
      setPlacedNotifySecret(secret);
      setQtyById({});
      if (id && secret) {
        setNotifyDialogOpen(true);
      }
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Order failed.");
    } finally {
      setSubmitting(false);
    }
  }, [cartLines, guestUserId, sid, tableLabel]);

  const dismissNotifyDialog = useCallback(() => {
    setNotifyDialogOpen(false);
  }, []);

  const enableOrderNotifications = useCallback(async () => {
    if (!placedOrderId || !placedNotifySecret) return;
    if (!vapidPublic) {
      showErrorMessage("Notifications are not set up for this site yet.");
      setNotifyDialogOpen(false);
      return;
    }
    if (!("Notification" in window)) {
      showErrorMessage("This browser does not support notifications.");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      showErrorMessage("This browser does not support push updates.");
      return;
    }

    setNotifyBusy(true);
    try {
      let perm = Notification.permission;
      if (perm === "default") {
        perm = await Notification.requestPermission();
      }
      if (perm !== "granted") {
        showErrorMessage(
          perm === "denied"
            ? "Notifications are blocked. Enable them in your browser settings if you change your mind."
            : "Notifications were not allowed.",
        );
        return;
      }

      const reg = await navigator.serviceWorker.register("/order-push-sw.js");
      await reg.update();
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublic),
      });
      const subscription = sub.toJSON();
      if (!subscription.keys?.auth || !subscription.keys?.p256dh) {
        throw new Error("Could not create a push subscription.");
      }

      const res = await fetch(
        `/api/stores/${sid}/public/orders/${encodeURIComponent(placedOrderId)}/web-push`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notifySecret: placedNotifySecret,
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
              },
              expirationTime: subscription.expirationTime ?? null,
            },
          }),
        },
      );
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => ({}));
        const msg =
          body &&
          typeof body === "object" &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : "Could not save notification preferences.";
        throw new Error(msg);
      }
      showSuccessMessage("You will get updates when the kitchen changes your order.");
      setNotifyDialogOpen(false);
    } catch (e: unknown) {
      showErrorMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setNotifyBusy(false);
    }
  }, [placedNotifySecret, placedOrderId, sid]);

  const resetOrderFlow = useCallback(() => {
    setPlacedOrderId(null);
    setPlacedNotifySecret(null);
    setNotifyDialogOpen(false);
  }, []);

  if (placedOrderId) {
    return (
      <>
        <div className="mx-auto max-w-md space-y-4 p-6 text-center">
          <p className="text-lg font-semibold text-foreground">Order sent</p>
          <p className="text-sm text-muted">
            The kitchen has your order for table{" "}
            <span className="font-medium text-foreground">{tableLabel}</span>.
          </p>
          <p className="text-xs text-muted">Reference: {placedOrderId}</p>
          {placedNotifySecret ? (
            <Button variant="link" className="h-auto p-0 text-sm" asChild>
              <Link href={routeStoreOrderTrack(storeId, placedOrderId, placedNotifySecret)}>
                Track order status
              </Link>
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={resetOrderFlow}>
            Order more
          </Button>
        </div>

        <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
          <DialogContent className="sm:max-w-md" hideCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Get order updates?</DialogTitle>
              <DialogDescription className="text-left">
                If you allow notifications from <strong>{storeName}</strong>, we will
                send you a short alert when your order status changes (for example when
                it is being prepared or ready).
              </DialogDescription>
            </DialogHeader>
            {!vapidPublic ? (
              <p className="text-sm text-muted">
                Push notifications are not configured on this site yet. You can still
                watch the counter or ask staff for updates.
              </p>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={dismissNotifyDialog}
                disabled={notifyBusy}
              >
                No thanks
              </Button>
              <Button
                type="button"
                onClick={() => void enableOrderNotifications()}
                disabled={notifyBusy || !vapidPublic}
              >
                {notifyBusy ? "Working…" : "Allow notifications"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-16 sm:p-6">
      <header className="space-y-1">
        <p className="text-lg font-semibold text-foreground">{storeName}</p>
        <p className="text-sm text-muted">
          Table / area:{" "}
          <span className="font-medium text-foreground">{tableLabel}</span>
        </p>
        {publicNote?.trim() ? (
          <p className="text-sm text-muted">{publicNote.trim()}</p>
        ) : null}
      </header>

      {load === "loading" || load === "idle" ? (
        <p className="text-sm text-muted">Loading menu…</p>
      ) : null}
      {load === "error" ? (
        <p className="text-sm text-destructive">{loadError}</p>
      ) : null}

      {load === "ready" && items.length === 0 ? (
        <p className="text-sm text-muted">No dishes available yet.</p>
      ) : null}

      {load === "ready" && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((it) => {
            const q = qtyById[it.id] ?? 0;
            return (
              <li
                key={it.id}
                className="flex gap-3 rounded-xl border border-border bg-background p-3 shadow-theme-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MENU_ITEM_CARD_IMAGE_URL}
                  alt=""
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{it.name}</p>
                  {it.description?.trim() ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                      {it.description.trim()}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                    {formatMoney(it.priceCents)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 min-w-8 px-2"
                      onClick={() => bump(it.id, -1)}
                      disabled={q <= 0}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">{q}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 min-w-8 px-2"
                      onClick={() => bump(it.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {cartLines.length > 0 ? (
        <section
          className={cn(
            "sticky bottom-0 space-y-3 rounded-xl border border-border bg-background/95 p-4 shadow-theme-md backdrop-blur",
          )}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Total</span>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {formatMoney(cartTotalCents)}
            </span>
          </div>
          {submitError ? (
            <p className="text-xs text-destructive">{submitError}</p>
          ) : null}
          <Button
            type="button"
            className="w-full"
            disabled={submitting}
            onClick={() => void placeOrder()}
          >
            {submitting ? "Sending…" : "Place order"}
          </Button>
        </section>
      ) : null}
    </div>
  );
}
