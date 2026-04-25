import type { ReactNode } from "react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { FirebaseConfigBridge } from "@/components/providers/FirebaseConfigBridge";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import type { FirebaseWebClientConfig } from "@/config/config";

type AppRootProvidersProps = Readonly<{
  firebaseWebConfig: FirebaseWebClientConfig | null;
  children: ReactNode;
}>;

export function AppRootProviders({
  firebaseWebConfig,
  children,
}: AppRootProvidersProps) {
  const firebaseWebReady = firebaseWebConfig !== null;

  return (
    <ThemeProvider>
      <FirebaseConfigBridge config={firebaseWebConfig} />
      <AuthProvider firebaseWebReady={firebaseWebReady}>
        <ToasterProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
