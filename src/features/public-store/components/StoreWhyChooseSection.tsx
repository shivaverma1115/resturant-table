import Link from "next/link";
import { Bean, Coffee, CupSoda } from "lucide-react";

type StoreWhyChooseSectionProps = Readonly<{
  aboutHref: string;
}>;

export function StoreWhyChooseSection({ aboutHref }: StoreWhyChooseSectionProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
            alt="Barista preparing coffee"
            className="h-full min-h-[320px] w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Why choose us</p>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight text-zinc-100 sm:text-4xl">
            New London Coffee Founded For Extraordinary Test
          </h2>
          <p className="max-w-xl text-sm leading-7 text-zinc-300">
            We focus on premium beans, careful roasting, and precise brewing to
            deliver rich aroma and a smooth finish in every cup.
          </p>

          <div className="space-y-4 pt-1">
            <article className="flex items-start gap-3">
              <Bean className="mt-0.5 size-5 text-amber-300" aria-hidden />
              <div>
                <h3 className="font-medium text-zinc-100">Natural Coffee Beans</h3>
                <p className="text-sm text-zinc-400">
                  Ethically sourced beans selected for depth and consistency.
                </p>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <Coffee className="mt-0.5 size-5 text-amber-300" aria-hidden />
              <div>
                <h3 className="font-medium text-zinc-100">100% ISO Certification</h3>
                <p className="text-sm text-zinc-400">
                  Hygiene-first preparation and kitchen quality standards.
                </p>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <CupSoda className="mt-0.5 size-5 text-amber-300" aria-hidden />
              <div>
                <h3 className="font-medium text-zinc-100">Signature Taste Profiles</h3>
                <p className="text-sm text-zinc-400">
                  Balanced blends with flavors tuned for every preference.
                </p>
              </div>
            </article>
          </div>

          <Link
            href={aboutHref}
            className="inline-flex rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Explore more
          </Link>
        </div>
      </div>
    </section>
  );
}
