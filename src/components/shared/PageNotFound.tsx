import Link from "next/link";

import { GoBackButton } from "@/components/shared/GoBackButton";
import { ROUTES } from "@/lib/constants";

type PageNotFoundProps = {
  /** Shown under the title */
  description?: string;
};

export function PageNotFound({
  description = "The page you are looking for does not exist or has been moved.",
}: PageNotFoundProps) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-100 via-white to-zinc-50 px-4 py-16 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-lg text-center">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Error 404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ROUTES.HOME}
            className="inline-flex h-11 min-w-[8.5rem] items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            Back to home
          </Link>
          <GoBackButton className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
