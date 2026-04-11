export default function AuthGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full w-full min-w-0 flex-1 flex-col bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <main className="flex min-h-full w-full flex-1 flex-col items-center justify-center px-4 py-16">
        {children}
      </main>
    </div>
  );
}

