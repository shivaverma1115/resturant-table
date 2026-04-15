import Link from "next/link";

type StoreAboutPreviewSectionProps = Readonly<{
  aboutHref: string;
}>;

export function StoreAboutPreviewSection({
  aboutHref,
}: StoreAboutPreviewSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="space-y-6 p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">About us</p>
          <h2 className="max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
            Organic & Fresh Coffee Provider Center
          </h2>
          <p className="max-w-xl text-sm leading-7 text-zinc-300">
            We brew every cup with carefully selected beans, thoughtful roasting,
            and warm hospitality. Our menu is made for guests who love bold taste,
            balanced aroma, and a cozy place to pause.
          </p>

          <div className="max-w-md rounded-xl bg-amber-200/80 p-4 text-zinc-900">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Store owner portrait"
                className="size-12 rounded-full object-cover"
                loading="lazy"
              />
              <p className="text-sm italic leading-6">
                "Every cup we serve is crafted to create a memorable moment for our
                guests."
              </p>
            </div>
          </div>

          <Link
            href={aboutHref}
            className="inline-flex rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
          >
            Read full story
          </Link>
        </div>

        <div className="relative min-h-[320px] lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
            alt="Coffee product and cup"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/20" />
        </div>
      </div>
    </section>
  );
}
