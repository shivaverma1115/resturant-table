import { StoreBackToTopButton } from "@/features/public-store/components/StoreBackToTopButton";
import { StorePublicFooter } from "@/features/public-store/components/StorePublicFooter";
import { StorePublicNavbar } from "@/features/public-store/components/StorePublicNavbar";
import { StoreTestModeBanner } from "@/features/public-store/components/StoreTestModeBanner";
import {
  storeOrderPath,
  storePrimaryNavLinks,
} from "@/features/public-store/lib/public-store-paths";
import { resolveStoreSlug } from "@/features/public-store/lib/public-store-route-utils";
import { PublicStoreSessionProvider } from "@/features/public-store/state/PublicStoreSessionProvider";

type StorePublicLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}>;

export default async function StorePublicLayout({
  children,
  params,
}: StorePublicLayoutProps) {
  const storeSlug = await resolveStoreSlug(params);
  const orderHref = storeOrderPath(storeSlug);

  return (
    <PublicStoreSessionProvider storeSlug={storeSlug}>
      <div className="min-h-[calc(100dvh-3.5rem)] overflow-x-clip border-t border-border bg-surface-subtle/20">
        <StorePublicNavbar
          storeSlug={storeSlug}
          primaryLinks={storePrimaryNavLinks(storeSlug)}
          orderHref={orderHref}
        />
        <StoreTestModeBanner />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
          {children}
        </main>
        <StorePublicFooter />
        <StoreBackToTopButton />
      </div>
    </PublicStoreSessionProvider>
  );
}
