import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]", className)}>
      <div
        className={cn("h-full rounded-full stripe-accent transition-all duration-500 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
