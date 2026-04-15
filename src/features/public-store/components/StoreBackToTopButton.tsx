"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

export function StoreBackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Move to top"
      className={cn(
        "fixed bottom-5 right-4 z-50 inline-flex size-11 items-center justify-center rounded-full border border-amber-300/60 bg-zinc-950/90 text-amber-300 shadow-lg backdrop-blur transition-all duration-300 hover:bg-zinc-900 sm:bottom-6 sm:right-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ChevronUp className="size-5" />
    </button>
  );
}
