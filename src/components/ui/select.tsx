import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 pr-9 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-red)] focus:ring-1 focus:ring-[var(--color-red)] disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
      </div>
    );
  }
);
Select.displayName = "Select";
