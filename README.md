# 🏁 Placement OS — V1

A fully functional, offline-first placement-season command center. Dark **Formula 1 / Oracle Red Bull Racing** themed. No backend, no auth, no AI — every feature works against `localStorage`.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- React Router (client-side routing)
- Hand-built shadcn-style component library (Button, Card, Dialog, Select, Switch, Tabs, Badge, Progress, Toast...)
- lucide-react icons
- 100% client-side persistence via `localStorage` (no server, no database)

## Getting Started

```bash
npm install
npm run dev       # local dev server, http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

No environment variables, API keys, or backend services are required. All data lives in your browser's `localStorage` under keys prefixed `pos_*`. Clearing site data / browser storage will erase your data — there is currently no export/import (see To-Do list #2).

## Architecture

```
src/
  types/            -> Shared TypeScript domain models (DailyEntry, DSAProblem, Job, ResumeFile...)
  hooks/
    useLocalStorage.ts  -> Generic, cross-tab-synced localStorage-backed state hook
  store/            -> One hook per domain, all CRUD + derived stats live here
    useDailyEntries.ts
    useDSAProblems.ts
    useJobs.ts
    useResumes.ts
    useStreak.ts     -> Combines daily entries + DSA activity into streak/heatmap data
  components/
    ui/              -> Reusable primitives (button, card, dialog, input, select, switch, tabs, toast...)
    layout/          -> Sidebar, MobileNav, Topbar, AppShell
    dashboard/       -> StatCard
    daily/, dsa/, jobs/, resume/, streak/  -> Feature-specific composed components
  pages/             -> One page per module, wired to the store hooks + UI components
  lib/utils.ts        -> cn(), date helpers, id generation, formatting
```

**Data flow:** every page calls a `use<Domain>()` store hook. Each store hook wraps `useLocalStorage` and exposes typed CRUD functions (`add`, `update`, `delete`) plus derived/aggregated stats (e.g. `stats.today`, `stats.week`). Components never touch `localStorage` directly — this keeps persistence logic in one place per domain and makes every statistic a live computation over the same source of truth, so numbers across Dashboard, DSA Tracker, Job Tracker, etc. can never drift out of sync.

**Streak logic:** a day counts toward the streak only when all three are true: morning check-in completed, night check-in completed, and at least one DSA problem logged for that date. This single definition (`useStreak.ts`) drives the sidebar flame counter, the Dashboard "Today's Progress" ring, and the GitHub-style contribution grid.

## Modules (all fully functional)

1. **Dashboard** — current streak, today's progress checklist, DSA/application counts, health progress (water + steps + workout), quick actions, recent pipeline, weekly snapshot. Every number is computed live from the other four modules' stored data.
2. **Daily Tracker** — Morning check-in (sleep, mood, energy) and Night check-in (productivity, reflection, water, steps, workout) per calendar date, with a date navigator (prev/next day).
3. **DSA Tracker** — add/edit/delete/search/filter problems (platform, difficulty, topic, solved-alone/hint/solution flags, notes). Today/week/month/all-time counts auto-calculated.
4. **Job Tracker** — add/edit/delete/search/filter, drag-and-drop Kanban board (Wishlist -> Applied -> OA -> Interview -> Offer / Rejected) and a list view, both backed by the same data.
5. **Resume Vault** — drag-and-drop or click-to-upload PDF resumes (stored as base64 in localStorage), category tagging (SDE/AI/GenAI/Frontend/Backend/ML), in-app preview (iframe), rename, download, delete.
6. **GitHub-style Streak Grid** — 53-week contribution heatmap, colored by completion level, current + longest streak, only increments when the full daily goal is met.

## Known constraints (by design, V1 scope)
- No authentication — single local user only.
- No backend/server — nothing leaves the browser.
- No AI features.
- No push/email notifications.
- `localStorage` has a practical ~5-10MB per-origin limit shared across all modules (resumes are the biggest consumer since PDFs are stored as base64, capped at 8MB/file in the uploader).

See `TODO.md` for the two prioritized to-do lists (immediate polish items vs. V2 roadmap).
