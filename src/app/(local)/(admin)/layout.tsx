export default function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full w-full min-w-0 flex-1 flex-col border-t border-amber-200/40 bg-amber-50/20 dark:border-amber-900/30 dark:bg-amber-950/10">
      {children}
    </div>
  );
}

