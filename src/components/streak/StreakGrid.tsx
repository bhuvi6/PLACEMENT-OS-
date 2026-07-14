import { useMemo, useState } from "react";
import { useStreak } from "@/store/useStreak";
import { cn, formatFriendlyDate } from "@/lib/utils";

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-[var(--color-surface-3)]",
  1: "bg-red-950/70",
  2: "bg-red-800/80",
  3: "bg-[var(--color-red)] shadow-[0_0_6px_-1px_rgba(225,6,0,0.8)]",
};

export function StreakGrid() {
  const { gridDays, currentStreak, longestStreak } = useStreak();
  const [hovered, setHovered] = useState<string | null>(null);

  const weeks = useMemo(() => {
    const w: typeof gridDays[] = [];
    for (let i = 0; i < gridDays.length; i += 7) {
      w.push(gridDays.slice(i, i + 7));
    }
    return w;
  }, [gridDays]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-dim)]">
          <span>
            Current:{" "}
            <span className="font-mono-num font-bold text-white">{currentStreak}d</span>
          </span>
          <span>
            Longest:{" "}
            <span className="font-mono-num font-bold text-white">{longestStreak}d</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-faint)]">
          <span>Less</span>
          {[0, 1, 2, 3].map((l) => (
            <span key={l} className={cn("h-2.5 w-2.5 rounded-sm", LEVEL_CLASSES[l])} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHovered(day.date)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "h-2.5 w-2.5 rounded-sm transition-transform hover:scale-125",
                    LEVEL_CLASSES[day.level]
                  )}
                  title={`${formatFriendlyDate(day.date)}${day.complete ? " — Goal complete" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {hovered && (
        <p className="mt-2 text-xs text-[var(--color-text-faint)]">{formatFriendlyDate(hovered)}</p>
      )}
    </div>
  );
}
