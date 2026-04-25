import { SiteHeader } from "@/components/shared/SiteHeader";

/**
 * Default shell for local UI routes. Swap or nest headers per segment
 * (e.g. `(dashboard)/layout.tsx`) when you need a different header.
 */
export default function LocalRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-dvh w-full min-w-0 flex-1 flex-col">{children}</div>
    </>
  );
}
