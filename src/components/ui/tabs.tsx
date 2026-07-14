import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1",
        className
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
            value === t.value
              ? "bg-[var(--color-red)] text-white shadow-[0_0_10px_-2px_rgba(225,6,0,0.6)]"
              : "text-[var(--color-text-dim)] hover:text-white"
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
