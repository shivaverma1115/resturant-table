import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  findPublicStoreDemoItemById,
  formatMoneyFromCents,
} from "@/features/public-store/lib/demo-store-items";
import {
  storeCartPath,
  storeItemsPath,
} from "@/features/public-store/lib/public-store-paths";
import { MENU_ITEM_CARD_IMAGE_URL } from "@/lib/constants";

type StoreItemDetailsPageProps = Readonly<{
  storeSlug: string;
  itemId: string;
}>;

export function StoreItemDetailsPage({ storeSlug, itemId }: StoreItemDetailsPageProps) {
  const item = findPublicStoreDemoItemById(itemId);

  if (!item) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-center">
        <p className="text-sm text-zinc-300">Item not found.</p>
        <Button className="mt-3" variant="outline" size="sm" asChild>
          <Link href={storeItemsPath(storeSlug)}>Back to items</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" asChild>
        <Link href={storeItemsPath(storeSlug)} className="inline-flex items-center gap-1">
          <ArrowLeft className="size-4" />
          Back to items
        </Link>
      </Button>

      <section className="grid gap-6 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-6 lg:grid-cols-[1fr_1fr]">
        <img
          src={MENU_ITEM_CARD_IMAGE_URL}
          alt={item.name}
          className="h-full min-h-[260px] w-full rounded-xl object-cover"
        />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-zinc-100">{item.name}</h1>
          <p className="text-sm text-zinc-300">{item.description}</p>
          <p className="text-sm text-zinc-400">Category: {item.location}</p>
          <p className="text-2xl font-semibold text-amber-300">
            {formatMoneyFromCents(item.priceCents)}
          </p>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="default" size="sm" disabled={!item.isAvailable}>
              Add to cart (UI only)
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href={storeCartPath(storeSlug)}>Open cart</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
