# Placement OS — To-Do Lists

## List 1 — V1 Hardening (do next, small/no new features)

- [ ] Add a "Reset day" action on Daily Tracker to clear a mistaken check-in without deleting other days.
- [ ] Add inline validation messages under form fields (currently validation surfaces only as a toast).
- [ ] Add empty-state illustrations/CTAs consistent across all five modules (Dashboard partially has this).
- [ ] Add keyboard shortcut (e.g. `N`) to open "Add Problem" / "Add Job" from their respective pages.
- [ ] Persist last-used view (Kanban vs List) and filters for Job Tracker across sessions.
- [ ] Add a confirm-before-navigate guard if a form dialog has unsaved input and the user clicks outside/Escape.
- [ ] Storage quota guard: warn the user before a resume upload would exceed remaining `localStorage` capacity.
- [ ] Accessibility pass: verify all interactive elements have visible focus rings and correct ARIA labels (dialogs, switches, kanban drag handles).
- [ ] Add unit tests for `useStreak`, `useDSAProblems` stats, and `useJobs` stats (pure calculation logic).
- [ ] Mobile polish: verify Kanban board horizontal scroll and Resume grid on narrow (360px) viewports.

## List 2 — V2 Roadmap (future, out of scope for this build)

- [ ] **Authentication** — multi-device sync via real user accounts.
- [ ] **Backend + database** — replace `localStorage` with a real API (Postgres/Supabase) so data survives browser resets and works across devices.
- [ ] **Data export/import** — JSON/CSV export of all trackers, and a restore/import flow.
- [ ] **AI features** — resume tailoring suggestions per job description, DSA topic recommendations based on weak areas, auto-generated weekly reflection summaries.
- [ ] **Notifications** — daily reminders for morning/night check-ins, streak-at-risk alerts, application follow-up reminders.
- [ ] **Analytics dashboard** — trend charts (mood vs productivity over time, topic-wise DSA mastery, application funnel conversion rate).
- [ ] **Calendar integration** — sync interview dates/OA deadlines to Google Calendar.
- [ ] **Collaboration** — share a read-only view of your pipeline/progress with a mentor or peer.
- [ ] **Resume parsing** — auto-extract skills/sections from uploaded PDFs to speed up categorization.
- [ ] **Native mobile app** — wrap or rebuild for iOS/Android with offline-first sync.
