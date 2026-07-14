import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Code2, Briefcase, FolderArchive } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/daily", label: "Daily", icon: ListChecks },
  { to: "/dsa", label: "DSA", icon: Code2 },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/resume", label: "Vault", icon: FolderArchive },
];

export function MobileNav() {
  return (
    <nav className="carbon-deep fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--color-border)] md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wide transition-colors",
              isActive ? "text-[var(--color-red-glow)]" : "text-[var(--color-text-faint)]"
            )
          }
        >
          <item.icon className="h-4.5 w-4.5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
