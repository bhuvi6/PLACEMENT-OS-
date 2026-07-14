import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { DailyEntry, Mood } from "@/types";
import { todayKey } from "@/lib/utils";

const STORAGE_KEY = "pos_daily_entries_v1";

function emptyEntry(date: string): DailyEntry {
  return {
    date,
    sleepHours: null,
    mood: null,
    energy: null,
    morningCompletedAt: null,
    productivity: null,
    reflection: "",
    waterLiters: null,
    steps: null,
    workoutDone: false,
    workoutType: "",
    nightCompletedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function useDailyEntries() {
  const [entries, setEntries] = useLocalStorage<Record<string, DailyEntry>>(
    STORAGE_KEY,
    {}
  );

  const getEntry = (date: string): DailyEntry => entries[date] ?? emptyEntry(date);

  const saveMorningCheckIn = (
    date: string,
    data: { sleepHours: number; mood: Mood; energy: number }
  ) => {
    setEntries((prev) => {
      const existing = prev[date] ?? emptyEntry(date);
      return {
        ...prev,
        [date]: {
          ...existing,
          sleepHours: data.sleepHours,
          mood: data.mood,
          energy: data.energy,
          morningCompletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const saveNightCheckIn = (
    date: string,
    data: {
      productivity: number;
      reflection: string;
      waterLiters: number;
      steps: number;
      workoutDone: boolean;
      workoutType: string;
    }
  ) => {
    setEntries((prev) => {
      const existing = prev[date] ?? emptyEntry(date);
      return {
        ...prev,
        [date]: {
          ...existing,
          productivity: data.productivity,
          reflection: data.reflection,
          waterLiters: data.waterLiters,
          steps: data.steps,
          workoutDone: data.workoutDone,
          workoutType: data.workoutType,
          nightCompletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const isDayFullyComplete = (date: string): boolean => {
    const e = entries[date];
    if (!e) return false;
    return Boolean(e.morningCompletedAt && e.nightCompletedAt);
  };

  const allEntries = Object.values(entries).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return {
    entries,
    allEntries,
    getEntry,
    saveMorningCheckIn,
    saveNightCheckIn,
    isDayFullyComplete,
    today: getEntry(todayKey()),
  };
}
