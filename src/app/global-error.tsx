"use client";

import "./globals.css";

import { PageError } from "@/components/shared/PageError";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <PageError error={error} reset={reset} />
      </body>
    </html>
  );
}
