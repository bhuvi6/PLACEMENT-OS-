import { cn } from "@/lib/utils";

/** A 1-10 (or custom range) tap-to-select scale used for energy / productivity / mood intensity */
export function SliderScale({
  value,
  onChange,
  min = 1,
  max = 10,
  className,
}: {
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-bold font-mono-num transition-all",
            value === n
              ? "border-[var(--color-red)] bg-[var(--color-red)] text-white shadow-[0_0_12px_-2px_rgba(225,6,0,0.7)]"
              : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-dim)] hover:border-[var(--color-border-hi)] hover:text-white"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
