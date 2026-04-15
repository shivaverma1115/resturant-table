"use client";

import { useEffect, useRef } from "react";

type StripImage = Readonly<{
  id: string;
  url: string;
  alt: string;
}>;

const STRIP_IMAGES: StripImage[] = [
  {
    id: "brew-1",
    url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
    alt: "Coffee cups on table",
  },
  {
    id: "brew-2",
    url: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80",
    alt: "Coffee pouring into dark mug",
  },
  {
    id: "brew-3",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    alt: "Barista pouring latte art",
  },
  {
    id: "brew-4",
    url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    alt: "Espresso machine brewing coffee",
  },
  {
    id: "brew-5",
    url: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh coffee cup with beans",
  },
];

export function StoreScrollableImageStripSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId = 0;
    const speedPxPerFrame = 0.7;

    const tick = () => {
      const half = el.scrollWidth / 2;
      el.scrollLeft += speedPxPerFrame;
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const loopImages = [...STRIP_IMAGES, ...STRIP_IMAGES];

  return (
    <section
      className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 overflow-hidden border-y border-zinc-800 bg-[#05090f] py-8"
      aria-label="Auto-scrolling coffee gallery"
    >
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-hidden px-4 pb-2 sm:gap-5 sm:px-6"
      >
        {loopImages.map((image, idx) => (
          <article
            key={`${image.id}-${idx}`}
            className="group relative h-64 w-[78vw] max-w-[360px] shrink-0 overflow-hidden rounded-xl border border-zinc-700/70 sm:h-72"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
          </article>
        ))}
      </div>
    </section>
  );
}
