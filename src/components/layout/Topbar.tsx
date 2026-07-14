export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-red-glow)]">
          {dateStr}
        </p>
        <h1 className="font-display text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-text-dim)]">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
