import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppRootProviders } from "@/components/providers";
import { getFirebaseWebClientConfig } from "@/config/config";
import { rootMetadata } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebaseWebConfig = getFirebaseWebClientConfig();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full min-h-dvh w-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-dvh w-full flex-col"
        suppressHydrationWarning
      >
        <AppRootProviders firebaseWebConfig={firebaseWebConfig}>
          {children}
        </AppRootProviders>
      </body>
    </html>
  );
}
