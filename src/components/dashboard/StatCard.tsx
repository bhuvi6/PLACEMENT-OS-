import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  suffix,
  accent = "red",
  footer,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  accent?: "red" | "yellow" | "blue" | "green";
  footer?: ReactNode;
  delay?: number;
}) {
  const accentMap: Record<string, string> = {
    red: "text-[var(--color-red-glow)] bg-red-950/30 border-red-900/40",
    yellow: "text-[var(--color-yellow)] bg-yellow-950/20 border-yellow-900/40",
    blue: "text-blue-400 bg-blue-950/20 border-blue-900/40",
    green: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="relative overflow-hidden p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">
              {label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-display font-mono-num text-3xl font-black text-white">
                {value}
              </span>
              {suffix && (
                <span className="text-sm font-semibold text-[var(--color-text-dim)]">
                  {suffix}
                </span>
              )}
            </div>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border", accentMap[accent])}>
            {icon}
          </div>
        </div>
        {footer && <div className="mt-3">{footer}</div>}
      </Card>
    </motion.div>
  );
}
