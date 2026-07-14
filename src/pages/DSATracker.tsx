import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { DSAFormDialog, type DSAFormValues } from "@/components/dsa/DSAFormDialog";
import { useDSAProblems } from "@/store/useDSAProblems";
import { useToast } from "@/components/ui/toast";
import type { DSAProblem, Difficulty } from "@/types";
import { formatFriendlyDate } from "@/lib/utils";
import { CalendarDays, Flame, ListChecks, Target } from "lucide-react";

const DIFF_VARIANT: Record<Difficulty, "green" | "yellow" | "red"> = {
  Easy: "green",
  Medium: "yellow",
  Hard: "red",
};

export default function DSATracker() {
  const [params, setParams] = useSearchParams();
  const { problems, addProblem, updateProblem, deleteProblem, stats } = useDSAProblems();
  const { push } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DSAProblem | null>(null);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("new") === "1") {
      setEditing(null);
      setDialogOpen(true);
      params.delete("new");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const platforms = useMemo(
    () => ["All", ...Array.from(new Set(problems.map((p) => p.platform)))],
    [problems]
  );

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase());
      const matchesPlatform = platformFilter === "All" || p.platform === platformFilter;
      const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
      return matchesSearch && matchesPlatform && matchesDifficulty;
    });
  }, [problems, search, platformFilter, difficultyFilter]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (p: DSAProblem) => {
    setEditing(p);
    setDialogOpen(true);
  };

  const handleSubmit = (v: DSAFormValues) => {
    if (editing) {
      updateProblem(editing.id, v);
      push("Problem updated.");
    } else {
      addProblem(v);
      push("Problem added.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProblem(id);
    setConfirmDeleteId(null);
    push("Problem deleted.");
  };

  return (
    <div>
      <Topbar title="DSA Tracker" subtitle="Every problem logged is a lap in the bank." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Solved Today" value={stats.today} accent="red" />
        <StatCard icon={<Flame className="h-5 w-5" fill="currentColor" />} label="This Week" value={stats.week} accent="yellow" />
        <StatCard icon={<ListChecks className="h-5 w-5" />} label="This Month" value={stats.month} accent="blue" />
        <StatCard icon={<Target className="h-5 w-5" />} label="All Time" value={stats.total} accent="green" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
            <Input
              placeholder="Search problems or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="sm:w-44">
            {platforms.map((p) => (
              <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>
            ))}
          </Select>
          <Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="sm:w-40">
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Problem
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-[var(--color-text-faint)]">
              {problems.length === 0
                ? "No problems logged yet. Hit \"Add Problem\" to start your streak."
                : "No problems match your filters."}
            </CardContent>
          </Card>
        )}
        <AnimatePresence>
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{p.name}</h3>
                      <Badge variant={DIFF_VARIANT[p.difficulty]}>{p.difficulty}</Badge>
                      <Badge variant="outline">{p.platform}</Badge>
                      <Badge variant="outline">{p.topic}</Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-faint)]">
                      <span>{formatFriendlyDate(p.dateSolved)}</span>
                      <span className="flex items-center gap-1">
                        {p.solvedAlone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                        Solved alone
                      </span>
                      {p.neededHint && (
                        <span className="flex items-center gap-1 text-[var(--color-yellow)]">
                          <Lightbulb className="h-3.5 w-3.5" /> Needed hint
                        </span>
                      )}
                      {p.neededSolution && (
                        <span className="text-red-400">Needed solution</span>
                      )}
                    </div>
                    {p.notes && (
                      <p className="mt-2 text-sm text-[var(--color-text-dim)]">{p.notes}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {confirmDeleteId === p.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(p.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <DSAFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        editing={editing}
      />
    </div>
  );
}
