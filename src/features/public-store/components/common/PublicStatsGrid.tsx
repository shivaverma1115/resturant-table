type PublicStatItem = Readonly<{
  id: string;
  value: string;
  label: string;
  subtitle?: string;
}>;

type PublicStatsGridProps = Readonly<{
  stats: PublicStatItem[];
  columns?: 2 | 3 | 4;
}>;

export function PublicStatsGrid({ stats, columns = 3 }: PublicStatsGridProps) {
  const gridColumnsClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-5 ${gridColumnsClass}`}>
      {stats.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-6"
        >
          <div className="flex items-start gap-4">
            <p className="text-5xl font-semibold tracking-tight text-amber-300">
              {item.value}
            </p>
            <div className="pt-1">
              <p className="text-lg font-semibold text-zinc-100">{item.label}</p>
              {item.subtitle ? (
                <p className="text-xs text-zinc-400">{item.subtitle}</p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
