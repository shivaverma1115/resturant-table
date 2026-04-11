"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 rounded-lg border border-border bg-surface-subtle"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
      )}
    </Button>
  );
}
