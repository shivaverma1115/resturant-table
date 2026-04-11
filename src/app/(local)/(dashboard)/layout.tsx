import { DashboardSidebar } from "../../../components/shared/DashboardSidebar";

export default async function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full min-w-0 flex-1 flex-col border-t border-border bg-surface-subtle/40 sm:flex-row dark:bg-zinc-950/80">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

