"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type StoreHeroCarouselProps = Readonly<{
  storeSlug: string;
  orderHref: string;
  aboutHref: string;
}>;

type HeroSlide = Readonly<{
  id: string;
  imageUrl: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}>;

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "craft",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "WELCOME TO OUR STORE",
    title: "Crafted Coffee\nMade With Passion",
    subtitle: "Fresh beans, warm ambiance, and unforgettable flavors.",
  },
  {
    id: "breakfast",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "MORNING FAVORITES",
    title: "Breakfast &\nBrunch Specials",
    subtitle: "Start your day with signature meals and artisan drinks.",
  },
  {
    id: "dinner",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=80",
    eyebrow: "CHEF RECOMMENDED",
    title: "Dinner Moments\nTo Remember",
    subtitle: "Curated plates, seasonal ingredients, and rich taste.",
  },
];

const AUTO_SLIDE_MS = 5000;

export function StoreHeroCarousel({
  storeSlug,
  orderHref,
  aboutHref,
}: StoreHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesCount = HERO_SLIDES.length;
  const activeSlide = useMemo(() => HERO_SLIDES[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slidesCount);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [slidesCount]);

  function goPrev() {
    setActiveIndex((current) => (current - 1 + slidesCount) % slidesCount);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % slidesCount);
  }

  return (
    <section
      className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 overflow-x-clip"
      aria-label="Store hero carousel"
    >
      <div className="relative min-h-[calc(100dvh-10rem)]">
        {HERO_SLIDES.map((slide, idx) => {
          const active = idx === activeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!active}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${slide.imageUrl}")` }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          );
        })}

        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-10rem)] w-full max-w-6xl items-center px-5 py-10 sm:px-8">
          <div className="max-w-3xl space-y-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-200">
              {activeSlide.eyebrow}
            </p>
            <h1 className="whitespace-pre-line text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              {activeSlide.title}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-200 sm:text-base">
              {activeSlide.subtitle}
            </p>
            <p className="text-sm text-zinc-300">
              Store: <span className="font-semibold text-white">{storeSlug}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={orderHref}
                className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400"
              >
                Order at table
              </Link>
              <Link
                href={aboutHref}
                className="rounded-md border border-zinc-300/70 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Explore more
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/25 p-2 text-white backdrop-blur hover:bg-black/50 sm:left-6"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/25 p-2 text-white backdrop-blur hover:bg-black/50 sm:right-6"
          onClick={goNext}
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                className={`h-2.5 rounded-full transition-all ${
                  active ? "w-7 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={active}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
