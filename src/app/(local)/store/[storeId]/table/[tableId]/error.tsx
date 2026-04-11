"use client";

import { PageError } from "@/components/shared/PageError";

export default function TableOrderErrorBoundary(
  props: Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
  }>,
) {
  return <PageError {...props} />;
}
