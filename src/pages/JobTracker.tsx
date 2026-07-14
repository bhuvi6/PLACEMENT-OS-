import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, ExternalLink, KanbanSquare, List } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { JobFormDialog, type JobFormValues } from "@/components/jobs/JobFormDialog";
import { JobKanban } from "@/components/jobs/JobKanban";
import { useJobs } from "@/store/useJobs";
import { useToast } from "@/components/ui/toast";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUSES } from "@/types";
import { formatFriendlyDate } from "@/lib/utils";
import { Briefcase, Send, Trophy, Timer } from "lucide-react";

const STATUS_VARIANT: Record<JobStatus, "default" | "blue" | "yellow" | "green" | "red"> = {
  Wishlist: "default",
  Applied: "blue",
  OA: "yellow",
  Interview: "yellow",
  Offer: "green",
  Rejected: "red",
};

export default function JobTracker() {
  const [params, setParams] = useSearchParams();
  const { jobs, addJob, updateJob, deleteJob, setStatus, stats } = useJobs();
  const { push } = useToast();

  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        !search ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || j.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (j: Job) => {
    setEditing(j);
    setDialogOpen(true);
  };

  const handleSubmit = (v: JobFormValues) => {
    if (editing) {
      updateJob(editing.id, v);
      push("Application updated.");
    } else {
      addJob(v);
      push("Application added.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    setConfirmDeleteId(null);
    push("Application deleted.");
  };

  return (
    <div>
      <Topbar title="Job Tracker" subtitle="Track every application from grid to chequered flag." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="Total Tracked" value={stats.total} accent="blue" />
        <StatCard icon={<Send className="h-5 w-5" />} label="Applied" value={stats.applied} accent="red" />
        <StatCard icon={<Timer className="h-5 w-5" />} label="OA / Interview" value={stats.oa + stats.interviews} accent="yellow" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Offers" value={stats.offers} accent="green" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint)]" />
            <Input
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {view === "list" && (
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
              <option value="All">All Statuses</option>
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={view}
            onChange={(v) => setView(v as "kanban" | "list")}
            tabs={[
              { value: "kanban", label: "Board", icon: <KanbanSquare className="h-3.5 w-3.5" /> },
              { value: "list", label: "List", icon: <List className="h-3.5 w-3.5" /> },
            ]}
          />
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Job
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-[var(--color-text-faint)]">
              No applications tracked yet. Add your first job to start the pipeline.
            </CardContent>
          </Card>
        ) : view === "kanban" ? (
          <JobKanban
            jobs={search ? filtered : jobs}
            onStatusChange={setStatus}
            onEdit={openEdit}
            onDelete={(id) => handleDelete(id)}
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((j) => (
                <motion.div
                  key={j.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{j.company}</h3>
                          <Badge variant={STATUS_VARIANT[j.status]}>{j.status}</Badge>
                          {j.location && <Badge variant="outline">{j.location}</Badge>}
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--color-text-dim)]">{j.role}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-faint)]">
                          <span>Applied {formatFriendlyDate(j.appliedDate)}</span>
                          {j.resumeUsed && <span>Resume: {j.resumeUsed}</span>}
                          {j.jobLink && (
                            <a href={j.jobLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--color-red-glow)] hover:underline">
                              Job link <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {j.notes && <p className="mt-2 text-sm text-[var(--color-text-dim)]">{j.notes}</p>}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(j)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {confirmDeleteId === j.id ? (
                          <div className="flex items-center gap-1">
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(j.id)}>
                              Confirm
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(j.id)} aria-label="Delete">
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
        )}
      </div>

      <JobFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        editing={editing}
      />
    </div>
  );
}
