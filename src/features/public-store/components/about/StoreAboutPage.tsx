import { Play } from "lucide-react";

import { StoreBookingParallaxSection } from "@/features/public-store/components/StoreBookingParallaxSection";
import { StoreClientFeedbackSection } from "@/features/public-store/components/StoreClientFeedbackSection";
import { PublicSectionHeading } from "@/features/public-store/components/common/PublicSectionHeading";
import { PublicStatsGrid } from "@/features/public-store/components/common/PublicStatsGrid";

type StoreAboutPageProps = Readonly<{
  storeSlug: string;
}>;

const ABOUT_STATS = [
  { id: "clients", value: "256+", label: "Premium Clients", subtitle: "Sed ut perspiciatis unde" },
  { id: "members", value: "362+", label: "Expert Members", subtitle: "Sed ut perspiciatis unde" },
  { id: "awards", value: "753+", label: "Winning Awards", subtitle: "Sed ut perspiciatis unde" },
  { id: "stories", value: "100+", label: "Store Stories", subtitle: "Sed ut perspiciatis unde" },
] as const;

const TEAM_MEMBERS = [
  {
    id: "chef-1",
    name: "James D. Carter",
    role: "Head Barista",
    imageUrl:
      "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "chef-2",
    name: "Emma R. Smith",
    role: "Coffee Specialist",
    imageUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "chef-3",
    name: "Michael A. Lee",
    role: "Senior Chef",
    imageUrl:
      "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "chef-4",
    name: "Olivia K. Green",
    role: "Pastry Expert",
    imageUrl:
      "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=420&q=80",
  },
] as const;

export function StoreAboutPage({ storeSlug }: StoreAboutPageProps) {
  return (
    <div className="space-y-8">
      <section className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 overflow-hidden border-y border-zinc-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1800&q=80")',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[220px] w-full max-w-6xl items-center px-4 py-10 sm:min-h-[260px] sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">Public store</p>
            <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">About Us</h1>
            <p className="mt-2 text-sm text-zinc-200">{storeSlug}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1566554424888-4e9e76a2d8f7?auto=format&fit=crop&w=1200&q=80"
              alt="Barista at coffee counter"
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-5">
            <PublicSectionHeading
              eyebrow="Why choose us"
              title="New London Coffee Founded For Extraordinary Taste"
              align="left"
            />
            <p className="text-sm leading-7 text-zinc-300">
              We build every guest experience around quality beans, strong team
              culture, and fast table ordering. Our goal is to keep flavor and
              service consistent every day.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>- Natural coffee beans sourced from trusted farms.</li>
              <li>- 100% quality-focused workflow from kitchen to table.</li>
              <li>- Fresh menu designed for families and groups.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <PublicStatsGrid stats={ABOUT_STATS} columns={4} />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-800">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80"
              alt="Coffee shop working team"
              className="h-[320px] w-full object-cover sm:h-[420px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/35" />
            <button
              type="button"
              className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg transition hover:bg-white"
              aria-label="Play intro video"
            >
              <Play className="ml-0.5 size-6 fill-current" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <PublicSectionHeading eyebrow="Meet our team" title="Meet Our Professional Chefs" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article key={member.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-44 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="mt-3 text-base font-semibold text-zinc-100">{member.name}</p>
                <p className="text-sm text-zinc-400">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <StoreClientFeedbackSection />
      <StoreBookingParallaxSection />
    </div>
  );
}
