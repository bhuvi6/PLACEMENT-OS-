import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame,
  Code2,
  Briefcase,
  HeartPulse,
  ListChecks,
  Plus,
  Sunrise,
  Moon,
  ArrowRight,
} from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StreakGrid } from "@/components/streak/StreakGrid";
import { useStreak } from "@/store/useStreak";
import { useDailyEntries } from "@/store/useDailyEntries";
import { useDSAProblems } from "@/store/useDSAProblems";
import { useJobs } from "@/store/useJobs";
import { todayKey } from "@/lib/utils";

export default function Dashboard() {
  const { currentStreak, todayComplete } = useStreak();
  const { today: todayEntry } = useDailyEntries();
  const { stats: dsaStats } = useDSAProblems();
  const { stats: jobStats, jobs } = useJobs();

  // Today's progress: 4 trackable actions -> morning, night, >=1 DSA, water/steps logged
  const todayTasks = [
    { label: "Morning check-in", done: Boolean(todayEntry.morningCompletedAt) },
    { label: "Solve 1+ DSA problem", done: dsaStats.today > 0 },
    { label: "Night check-in", done: Boolean(todayEntry.nightCompletedAt) },
    { label: "Workout / movement", done: todayEntry.workoutDone },
  ];
  const todayProgressPct =
    (todayTasks.filter((t) => t.done).length / todayTasks.length) * 100;

  // Health progress: hydration (target 3L) + steps (target 8000) + workout
  const waterPct = Math.min(100, ((todayEntry.waterLiters ?? 0) / 3) * 100);
  const stepsPct = Math.min(100, ((todayEntry.steps ?? 0) / 8000) * 100);
  const workoutPct = todayEntry.workoutDone ? 100 : 0;
  const healthPct = Math.round((waterPct + stepsPct + workoutPct) / 3);

  const recentJobs = jobs.slice(0, 4);

  return (
    <div>
      <Topbar
        title="Mission Control"
        subtitle={
          todayComplete
            ? "Today's daily goal is complete. Box, box — well done."
            : "Lights out and away we go. Let's log today's session."
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5" fill="currentColor" />}
          label="Current Streak"
          value={currentStreak}
          suffix="days"
          accent="yellow"
          delay={0}
        />
        <StatCard
          icon={<Code2 className="h-5 w-5" />}
          label="DSA Solved Today"
          value={dsaStats.today}
          suffix={`/ ${dsaStats.total} total`}
          accent="red"
          delay={0.05}
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Applications"
          value={jobStats.applied}
          suffix={`${jobStats.appliedThisWeek} this week`}
          accent="blue"
          delay={0.1}
        />
        <StatCard
          icon={<HeartPulse className="h-5 w-5" />}
          label="Health Progress"
          value={healthPct}
          suffix="%"
          accent="green"
          delay={0.15}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <span className="font-mono-num text-sm font-bold text-white">
              {Math.round(todayProgressPct)}%
            </span>
          </CardHeader>
          <CardContent>
            <Progress value={todayProgressPct} className="mb-4 h-2.5" />
            <div className="space-y-2">
              {todayTasks.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5"
                >
                  <span
                    className={`text-sm font-medium ${
                      t.done ? "text-[var(--color-text-dim)] line-through" : "text-white"
                    }`}
                  >
                    {t.label}
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      t.done
                        ? "border-[var(--color-red)] bg-[var(--color-red)]"
                        : "border-[var(--color-border-hi)]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Link to="/daily?section=morning">
              <Button variant="secondary" className="w-full justify-start" size="md">
                <Sunrise className="h-4 w-4 text-[var(--color-yellow)]" /> Morning Check-In
              </Button>
            </Link>
            <Link to="/daily?section=night">
              <Button variant="secondary" className="w-full justify-start" size="md">
                <Moon className="h-4 w-4 text-blue-400" /> Night Check-In
              </Button>
            </Link>
            <Link to="/dsa?new=1">
              <Button variant="secondary" className="w-full justify-start" size="md">
                <Code2 className="h-4 w-4 text-[var(--color-red-glow)]" /> Log DSA Problem
              </Button>
            </Link>
            <Link to="/jobs?new=1">
              <Button variant="secondary" className="w-full justify-start" size="md">
                <Plus className="h-4 w-4 text-emerald-400" /> Add Job Application
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consistency Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakGrid />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Pipeline</CardTitle>
            <Link to="/jobs" className="text-xs font-semibold text-[var(--color-red-glow)] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentJobs.length === 0 && (
              <p className="text-sm text-[var(--color-text-faint)]">
                No applications yet. Add your first one from the Job Tracker.
              </p>
            )}
            {recentJobs.map((j, i) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{j.company}</p>
                  <p className="text-xs text-[var(--color-text-faint)]">{j.role}</p>
                </div>
                <span className="rounded-full border border-[var(--color-border-hi)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--color-text-dim)]">
                  {j.status}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Snapshot — {todayKey()}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SnapshotStat label="DSA This Week" value={dsaStats.week} icon={<Code2 className="h-4 w-4" />} />
            <SnapshotStat label="DSA This Month" value={dsaStats.month} icon={<ListChecks className="h-4 w-4" />} />
            <SnapshotStat label="OA / Interviews" value={jobStats.oa + jobStats.interviews} icon={<Briefcase className="h-4 w-4" />} />
            <SnapshotStat label="Offers" value={jobStats.offers} icon={<Flame className="h-4 w-4" />} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SnapshotStat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 font-mono-num text-2xl font-black text-white">{value}</p>
    </div>
  );
}
