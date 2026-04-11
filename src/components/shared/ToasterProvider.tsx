"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ToasterProvider() {
  const isClient = useIsClient();
  const { resolvedTheme } = useTheme();

  if (!isClient) {
    return null;
  }

  return (
    <Toaster
      position="bottom-center"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
