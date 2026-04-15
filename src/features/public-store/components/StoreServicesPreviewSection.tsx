import { Coffee, Martini, Utensils } from "lucide-react";

type ServiceCard = Readonly<{
  id: string;
  title: string;
  imageUrl: string;
  Icon: typeof Utensils;
}>;

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "restaurant-menu",
    title: "Restaurant Menu",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    Icon: Utensils,
  },
  {
    id: "coffee-menu",
    title: "Coffee Menu",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    Icon: Coffee,
  },
  {
    id: "food-services",
    title: "Food Services",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    Icon: Martini,
  },
];

export function StoreServicesPreviewSection() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {SERVICE_CARDS.map(({ id, title, imageUrl, Icon }) => (
          <article
            key={id}
            className="group relative overflow-hidden rounded-xl border border-zinc-700/80"
          >
            <img
              src={imageUrl}
              alt={title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 m-3 rounded-lg border border-white/25" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center text-white">
              <Icon className="size-7 text-zinc-100" aria-hidden />
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
