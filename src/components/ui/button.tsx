import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-red)] text-white hover:bg-[var(--color-red-glow)] shadow-[0_0_0_1px_rgba(225,6,0,0.4)] hover:shadow-[0_0_20px_-2px_rgba(225,6,0,0.6)]",
        secondary:
          "bg-[var(--color-surface-3)] text-[var(--color-text)] hover:bg-[var(--color-border-hi)] border border-[var(--color-border)]",
        ghost:
          "bg-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
        outline:
          "bg-transparent border border-[var(--color-border-hi)] text-[var(--color-text)] hover:border-[var(--color-red)] hover:text-[var(--color-red-glow)]",
        destructive:
          "bg-transparent border border-red-900/50 text-red-400 hover:bg-red-950/40 hover:border-red-500",
        yellow:
          "bg-[var(--color-yellow)] text-black hover:brightness-110 shadow-[0_0_0_1px_rgba(255,201,6,0.4)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
