type CoffeeMenuItem = Readonly<{
  id: string;
  name: string;
  detail: string;
  price: string;
  imageUrl: string;
}>;

const LEFT_ITEMS: CoffeeMenuItem[] = [
  {
    id: "americano",
    name: "Americano Coffee",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$4.9",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=280&q=80",
  },
  {
    id: "barista-syrup",
    name: "Barista Pouring Syrup",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$3.5",
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1f864?auto=format&fit=crop&w=280&q=80",
  },
  {
    id: "cappuccino",
    name: "Cappuccino Arabica",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$2.8",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=280&q=80",
  },
];

const RIGHT_ITEMS: CoffeeMenuItem[] = [
  {
    id: "espresso",
    name: "Espresso Coffee",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$4.9",
    imageUrl:
      "https://images.unsplash.com/photo-1444418185997-1145401101e0?auto=format&fit=crop&w=280&q=80",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$6.0",
    imageUrl:
      "https://images.unsplash.com/photo-1464306076886-debede6fb71f?auto=format&fit=crop&w=280&q=80",
  },
  {
    id: "milk-cream",
    name: "Milk Cream Coffee",
    detail: "2/3 espresso, 1/3 steamed milk",
    price: "$7.5",
    imageUrl:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=280&q=80",
  },
];

function MenuColumn({ items }: Readonly<{ items: CoffeeMenuItem[] }>) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <article key={item.id} className="flex items-center gap-3">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-16 rounded-md object-cover sm:size-20"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-zinc-100">{item.name}</h3>
            <p className="truncate text-xs text-zinc-400 sm:text-sm">{item.detail}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px flex-1 border-t border-dashed border-amber-200/50" />
              <span className="text-sm font-semibold text-amber-300">{item.price}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function StorePopularMenuPreviewSection() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#06090f] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Choose best coffee</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Kaffen Popular Coffee Menu
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            <MenuColumn items={LEFT_ITEMS} />
            <MenuColumn items={RIGHT_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}
