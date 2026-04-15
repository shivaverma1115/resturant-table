import { PublicStatsGrid } from "@/features/public-store/components/common/PublicStatsGrid";

const STATS = [
  {
    id: "premium-clients",
    value: "256+",
    label: "Premium Clients",
    subtitle: "Sed ut perspiciatis unde",
  },
  {
    id: "expert-members",
    value: "362+",
    label: "Expert Members",
    subtitle: "Sed ut perspiciatis unde",
  },
  {
    id: "winning-awards",
    value: "753+",
    label: "Winning Awards",
    subtitle: "Sed ut perspiciatis unde",
  },
];

export function StoreStatsStripSection() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-[#05090f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <PublicStatsGrid stats={STATS} columns={3} />
      </div>
    </section>
  );
}
