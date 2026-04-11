import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components/shared/AuthProvider";
import { FirebaseConfigBridge } from "@/components/shared/FirebaseConfigBridge";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ToasterProvider } from "@/components/shared/ToasterProvider";
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
  const firebaseWebReady = firebaseWebConfig !== null;

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
        <ThemeProvider>
          <FirebaseConfigBridge config={firebaseWebConfig} />
          <AuthProvider firebaseWebReady={firebaseWebReady}>
            <ToasterProvider />
            <SiteHeader firebaseWebReady={firebaseWebReady} />
            <div className="flex min-h-dvh w-full min-w-0 flex-1 flex-col">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
