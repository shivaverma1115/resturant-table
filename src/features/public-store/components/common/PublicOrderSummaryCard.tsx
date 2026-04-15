import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

type PublicOrderSummaryCardProps = Readonly<{
  itemCount: number;
  totalLabel: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaDisabled?: boolean;
  note?: string;
}>;

export function PublicOrderSummaryCard({
  itemCount,
  totalLabel,
  ctaLabel = "Checkout",
  ctaHref,
  ctaDisabled = false,
  note,
}: PublicOrderSummaryCardProps) {
  return (
    <section className="sticky bottom-4 z-30 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-zinc-200">
          <ShoppingCart className="size-4 text-amber-300" />
          <span className="text-sm">{itemCount} item(s) selected</span>
        </div>
        <p className="text-sm font-semibold text-zinc-100">Total: {totalLabel}</p>
        {ctaHref ? (
          <Button type="button" variant="default" size="sm" asChild disabled={ctaDisabled}>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : (
          <Button type="button" variant="default" size="sm" disabled={ctaDisabled}>
            {ctaLabel}
          </Button>
        )}
      </div>
      {note ? <p className="mt-2 text-xs text-zinc-400">{note}</p> : null}
    </section>
  );
}
