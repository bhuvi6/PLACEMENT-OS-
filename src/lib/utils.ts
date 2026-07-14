import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

export function todayKey(): string {
  const d = new Date();
  return toDateKey(d);
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateKey(dt);
}

export function formatFriendlyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isSameWeek(dateKey: string, refKey: string): boolean {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const [ry, rm, rd] = refKey.split("-").map(Number);
  const ref = new Date(ry, rm - 1, rd);
  const day = ref.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(ref);
  weekStart.setDate(ref.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return dt >= weekStart && dt < weekEnd;
}

export function isSameMonth(dateKey: string, refKey: string): boolean {
  return dateKey.slice(0, 7) === refKey.slice(0, 7);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
