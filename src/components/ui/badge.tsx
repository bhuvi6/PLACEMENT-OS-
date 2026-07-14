import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-[var(--color-border-hi)] bg-[var(--color-surface-3)] text-[var(--color-text-dim)]",
        red: "border-red-900/50 bg-red-950/40 text-red-400",
        yellow: "border-yellow-900/40 bg-yellow-950/30 text-[var(--color-yellow)]",
        green: "border-emerald-900/50 bg-emerald-950/30 text-emerald-400",
        blue: "border-blue-900/50 bg-blue-950/30 text-blue-400",
        outline: "border-[var(--color-border-hi)] bg-transparent text-[var(--color-text-dim)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
