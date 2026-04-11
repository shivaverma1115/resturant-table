"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ROUTES } from "@/lib/constants";

type PageErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function PageError({ error, reset }: PageErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-50/80 via-zinc-50 to-zinc-100 px-4 py-12 dark:from-red-950/20 dark:via-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/90 bg-white/90 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          We could not complete this action. You can try again, or return to
          the home page.
        </p>
        {process.env.NODE_ENV === "development" && error.message ? (
          <pre className="mt-4 max-h-28 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left text-xs text-red-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-red-200">
            {error.message}
          </pre>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={ROUTES.HOME}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
