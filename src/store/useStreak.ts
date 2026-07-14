import { useDailyEntries } from "@/store/useDailyEntries";
import { useDSAProblems } from "@/store/useDSAProblems";
import { addDays, todayKey, toDateKey } from "@/lib/utils";

/**
 * A day counts toward the streak when the user has:
 *  - completed the morning check-in
 *  - completed the night check-in
 *  - solved at least one DSA problem
 * This is the single "daily goal" definition used across the app.
 */
export function useStreak() {
  const { entries } = useDailyEntries();
  const { problems } = useDSAProblems();

  const solvedDates = new Set(problems.map((p) => p.dateSolved));

  const isGoalComplete = (date: string): boolean => {
    const e = entries[date];
    if (!e) return false;
    return Boolean(e.morningCompletedAt) && Boolean(e.nightCompletedAt) && solvedDates.has(date);
  };

  const today = todayKey();

  // Current streak: walk backwards from today. If today isn't complete yet,
  // that's fine (day isn't over) — start counting from yesterday instead,
  // but only if today has zero progress; if today IS complete, include it.
  let streak = 0;
  let cursor = isGoalComplete(today) ? today : addDays(today, -1);
  // If today isn't complete, streak should still reflect consecutive completed days ending yesterday
  if (!isGoalComplete(today)) {
    cursor = addDays(today, -1);
  }
  while (isGoalComplete(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  // Longest streak across all recorded history
  const allDateKeys = new Set<string>([
    ...Object.keys(entries),
    ...problems.map((p) => p.dateSolved),
  ]);
  let longest = 0;
  if (allDateKeys.size > 0) {
    const sorted = Array.from(allDateKeys).sort();
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    let run = 0;
    let d = first;
    // bound the loop
    let guard = 0;
    while (d <= last && guard < 3660) {
      if (isGoalComplete(d)) {
        run += 1;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
      d = addDays(d, 1);
      guard += 1;
    }
  }

  // Build a 371-day (53 week) contribution grid ending today, GitHub-style
  const gridDays: { date: string; complete: boolean; level: number }[] = [];
  const totalDays = 371;
  const start = addDays(today, -(totalDays - 1));
  let d = start;
  for (let i = 0; i < totalDays; i++) {
    const complete = isGoalComplete(d);
    const count = solvedDates.has(d)
      ? problems.filter((p) => p.dateSolved === d).length
      : 0;
    let level = 0;
    if (complete) level = 3;
    else if (count > 0 || entries[d]) level = entries[d]?.nightCompletedAt ? 2 : 1;
    gridDays.push({ date: toDateKey(new Date(d)), complete, level });
    d = addDays(d, 1);
  }

  return {
    currentStreak: streak,
    longestStreak: longest,
    isGoalComplete,
    gridDays,
    todayComplete: isGoalComplete(today),
  };
}
