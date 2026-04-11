type PageLoadingProps = {
  message?: string;
  /** Use inside nested layouts so height does not force full viewport */
  compact?: boolean;
};

export function PageLoading({
  message = "Loading…",
  compact = false,
}: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={
        compact
          ? "flex min-h-[min(60vh,28rem)] w-full flex-col items-center justify-center px-4 py-16"
          : "flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-zinc-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950"
      }
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-2xl border border-zinc-200/80 bg-white/60 shadow-sm backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-900/60" />
          <span className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-emerald-600 dark:border-t-emerald-400 motion-safe:animate-spin dark:shadow-[0_0_24px_-4px_rgba(52,211,153,0.35)]" />
          <span className="relative z-10 block h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90 shadow-inner dark:from-emerald-400 dark:to-teal-500" />
        </div>
        <div className="max-w-xs text-center">
          <p className="text-sm font-medium tracking-wide text-zinc-700 dark:text-zinc-200">
            {message}
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            Please wait a moment.
          </p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 motion-safe:animate-pulse dark:bg-emerald-400/50"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
