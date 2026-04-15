import Link from "next/link";
import {
  ChefHat,
  Coffee,
  CookingPot,
  Soup,
  Utensils,
  Wine,
} from "lucide-react";

const PARTNER_ICONS = [Utensils, Coffee, CookingPot, Wine, Soup, ChefHat] as const;

export function StoreBookingParallaxSection() {
  return (
    <section className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 overflow-hidden border-y border-zinc-800 bg-[#05090f]">
      <div className="relative isolate min-h-[210px] sm:min-h-[240px]">
        {/* Background scrolls naturally with the page (not fixed). */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1800&q=80")',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />

        <div className="relative z-10 mx-auto flex h-full min-h-[210px] w-full max-w-6xl flex-col justify-center gap-4 px-4 py-8 sm:min-h-[240px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">
              Need a table on coffee house
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
              Booking Table For Your & Family Members
            </h2>
          </div>

          <Link
            href="#"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Booking table
          </Link>
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-[#060c14] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 text-zinc-600 sm:grid-cols-6">
          {PARTNER_ICONS.map((Icon, idx) => (
            <div
              key={`partner-${idx}`}
              className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/25 py-4"
            >
              <Icon className="size-7" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
