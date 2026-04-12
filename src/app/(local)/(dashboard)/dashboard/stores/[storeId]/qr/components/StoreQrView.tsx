"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  routeDashboardStoreLiveOrders,
  routeDashboardStorePreview,
  routeStoreOrderAtTable,
} from "@/lib/constants";
import { showSuccessMessage } from "@/lib/notify";

type StoreQrViewProps = Readonly<{
  storeId: string;
  storeName: string;
  /** Absolute origin for QR (e.g. https://your-domain.com). */
  publicOrigin: string;
}>;

export function StoreQrView({ storeId, storeName, publicOrigin }: StoreQrViewProps) {
  const [tableLabel, setTableLabel] = useState("1");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const effectiveTableLabel = tableLabel.trim() || "1";

  const guestPath = useMemo(
    () => routeStoreOrderAtTable(storeId, effectiveTableLabel),
    [storeId, effectiveTableLabel],
  );

  const fullUrl = useMemo(() => {
    const base = publicOrigin.replace(/\/$/, "");
    return `${base}${guestPath}`;
  }, [guestPath, publicOrigin]);

  useEffect(() => {
    let cancelled = false;
    setQrError(null);
    void QRCode.toDataURL(fullUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#14532d", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError("Could not generate QR image.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fullUrl]);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showSuccessMessage("Link copied.");
    } catch {
      /* ignore */
    }
  }, [fullUrl]);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Table QR — {storeName}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter any table or area name (letters, numbers, symbols, unicode). Guests who
          scan the code open your menu and can place an order; each order includes this
          label so you know where it came from.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="table-label">Table / area label</Label>
        <Input
          id="table-label"
          value={tableLabel}
          onChange={(e) => setTableLabel(e.target.value)}
          placeholder="e.g. 12, T-A, Patio #2, 露台-A"
          maxLength={80}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted">Max 80 characters. Avoid only spaces.</p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 shadow-theme-sm">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode
          <img src={qrDataUrl} alt="QR code linking to guest order page" className="size-[280px]" />
        ) : qrError ? (
          <p className="text-sm text-destructive">{qrError}</p>
        ) : (
          <p className="text-sm text-muted">Generating QR…</p>
        )}
        <div className="w-full space-y-2 break-all text-center text-xs text-muted">
          <p className="font-mono">{fullUrl}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void copyUrl()}>
            Copy link
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={routeDashboardStoreLiveOrders(storeId)}>Live orders</Link>
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={routeDashboardStorePreview(storeId)}>Preview store</Link>
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted">
        Set <code className="rounded bg-surface-subtle px-1">NEXT_PUBLIC_FIREBASE_DATABASE_URL</code>{" "}
        in <code className="rounded bg-surface-subtle px-1">.env</code> and deploy{" "}
        <code className="rounded bg-surface-subtle px-1">firebase/database.rules.json</code> so
        guest orders sync in real time on the Live orders page.
      </p>
    </div>
  );
}
