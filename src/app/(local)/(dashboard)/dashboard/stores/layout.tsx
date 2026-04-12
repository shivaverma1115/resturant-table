import { StoresSubnav } from "./components/StoresSubnav";

export default function DashboardStoresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <StoresSubnav />
      {children}
    </main>
  );
}
