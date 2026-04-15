import { PAGE_TITLES } from "@/lib/constants";
import {
  StoreAboutPreviewSection,
  StoreBlogNewsSection,
  StoreBookingParallaxSection,
  StoreClientFeedbackSection,
  StoreHeroCarousel,
  StorePopularMenuPreviewSection,
  StoreScrollableImageStripSection,
  StoreServicesPreviewSection,
  StoreStatsStripSection,
  StoreWhyChooseSection,
} from "@/features/public-store/components/landing/sections";

type StoreLandingPageProps = Readonly<{
  storeSlug: string;
  orderHref: string;
  aboutHref: string;
}>;

export function StoreLandingPage({
  storeSlug,
  orderHref,
  aboutHref,
}: StoreLandingPageProps) {
  return (
    <div className="space-y-8">
      <StoreHeroCarousel
        storeSlug={storeSlug}
        orderHref={orderHref}
        aboutHref={aboutHref}
      />
      <StoreAboutPreviewSection aboutHref={aboutHref} />
      <StoreServicesPreviewSection />
      <StorePopularMenuPreviewSection />
      <StoreWhyChooseSection aboutHref={aboutHref} />
      <StoreScrollableImageStripSection />
      <StoreClientFeedbackSection />
      <StoreStatsStripSection />
      <StoreBlogNewsSection />
      <StoreBookingParallaxSection />

      <section className="rounded-xl border border-border bg-background p-6">
        <p className="text-sm text-muted">
          {PAGE_TITLES.TABLE_ORDER} is available now for this store. Use the hero
          buttons above to start ordering or learn more about this venue.
        </p>
      </section>
    </div>
  );
}
