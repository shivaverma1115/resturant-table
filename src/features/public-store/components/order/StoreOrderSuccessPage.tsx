import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { storeItemsPath } from "@/features/public-store/lib/public-store-paths";
import { routeStoreOrderTrack } from "@/lib/constants";

type StoreOrderSuccessPageProps = Readonly<{
  storeSlug: string;
}>;

export function StoreOrderSuccessPage({ storeSlug }: StoreOrderSuccessPageProps) {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-center sm:p-8">
      <CheckCircle2 className="mx-auto size-14 text-emerald-400" />
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-400">Order placed</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-100 sm:text-4xl">
        Thank you for your order
      </h1>
      <p className="mt-3 text-sm text-zinc-300">
        Your order for {storeSlug} has been received. This is a UI preview screen.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="default" size="sm" asChild>
          <Link href={routeStoreOrderTrack(storeSlug, "demo-order", "demo-secret")}>
            Track order
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={storeItemsPath(storeSlug)}>Order more items</Link>
        </Button>
      </div>
    </section>
  );
}
