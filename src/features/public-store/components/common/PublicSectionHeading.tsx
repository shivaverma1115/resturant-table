type PublicSectionHeadingProps = Readonly<{
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}>;

export function PublicSectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: PublicSectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p
          className={`text-xs uppercase tracking-[0.2em] text-zinc-400 ${
            align === "center" ? "text-center" : "text-left"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl ${
          align === "center" ? "text-center" : "text-left"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
