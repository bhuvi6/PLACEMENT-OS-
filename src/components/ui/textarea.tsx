import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[90px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] outline-none transition-colors focus:border-[var(--color-red)] focus:ring-1 focus:ring-[var(--color-red)] disabled:opacity-50 resize-y",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
