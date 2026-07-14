import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Code2,
  Briefcase,
  FolderArchive,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/store/useStreak";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/daily", label: "Daily Tracker", icon: ListChecks },
  { to: "/dsa", label: "DSA Tracker", icon: Code2 },
  { to: "/jobs", label: "Job Tracker", icon: Briefcase },
  { to: "/resume", label: "Resume Vault", icon: FolderArchive },
];

export function Sidebar() {
  const { currentStreak } = useStreak();

  return (
    <aside className="carbon-deep fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-[var(--color-border)] md:flex">
      <div className="stripe-accent h-1 w-full" />
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-red)] shadow-[0_0_18px_-4px_rgba(225,6,0,0.8)]">
          <span className="font-display text-lg font-black text-white">P</span>
        </div>
        <div>
          <p className="font-display text-sm font-black uppercase tracking-wider text-white">
            Placement<span className="text-[var(--color-red-glow)]">OS</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
            Season 2027
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-[var(--color-red)] text-white shadow-[0_0_16px_-4px_rgba(225,6,0,0.7)]"
                  : "text-[var(--color-text-dim)] hover:bg-[var(--color-surface-2)] hover:text-white"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
        <div className="flex items-center gap-2">
          <Flame
            className={cn(
              "h-5 w-5",
              currentStreak > 0 ? "text-[var(--color-yellow)]" : "text-[var(--color-text-faint)]"
            )}
            fill={currentStreak > 0 ? "currentColor" : "none"}
          />
          <div>
            <p className="font-mono-num text-lg font-bold leading-none text-white">
              {currentStreak}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-faint)]">
              Day Streak
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
