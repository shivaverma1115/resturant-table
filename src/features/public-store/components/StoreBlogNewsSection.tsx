import Link from "next/link";
import { CalendarDays, User } from "lucide-react";

type BlogItem = Readonly<{
  id: string;
  title: string;
  date: string;
  author: string;
  imageUrl: string;
}>;

const BLOG_ITEMS: BlogItem[] = [
  {
    id: "blog-1",
    title: "SWR React Hooks With Next Incremental Static Regeneration",
    date: "14 August 2025",
    author: "Windstripe",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "blog-2",
    title: "Decisions For Building Flexible Components DevTools Browser",
    date: "14 August 2025",
    author: "Windstripe",
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "blog-3",
    title: "SWR React Hooks With Next Incremental Static Regeneration",
    date: "14 August 2025",
    author: "Windstripe",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
];

export function StoreBlogNewsSection() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Get every single update</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            Read Some Latest Blog & News
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-zinc-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-zinc-100">
                  {item.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {item.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="size-3.5" />
                    {item.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            href="#"
            className="inline-flex rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
