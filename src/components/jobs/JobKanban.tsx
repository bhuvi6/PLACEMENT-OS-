import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUSES } from "@/types";
import { cn, formatFriendlyDate } from "@/lib/utils";

const STATUS_COLORS: Record<JobStatus, string> = {
  Wishlist: "border-t-[var(--color-text-faint)]",
  Applied: "border-t-blue-500",
  OA: "border-t-[var(--color-yellow)]",
  Interview: "border-t-purple-500",
  Offer: "border-t-emerald-500",
  Rejected: "border-t-red-600",
};

export function JobKanban({
  jobs,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  jobs: Job[];
  onStatusChange: (id: string, status: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}) {
  const [dragOverCol, setDragOverCol] = useState<JobStatus | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {JOB_STATUSES.map((status) => {
        const columnJobs = jobs.filter((j) => j.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(status);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/job-id");
              if (id) onStatusChange(id, status);
              setDragOverCol(null);
            }}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-2 transition-colors",
              dragOverCol === status && "bg-[var(--color-surface-3)] ring-1 ring-[var(--color-red)]"
            )}
          >
            <div className={cn("mb-2 flex items-center justify-between border-t-2 px-1 pt-2", STATUS_COLORS[status])}>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text)]">{status}</span>
              <span className="font-mono-num text-xs font-bold text-[var(--color-text-faint)]">{columnJobs.length}</span>
            </div>
            <div className="flex min-h-[60px] flex-col gap-2">
              {columnJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  draggable
                  onDragStart={(e) => {
                    (e as unknown as DragEvent).dataTransfer?.setData("text/job-id", job.id);
                  }}
                  className="carbon cursor-grab rounded-md border border-[var(--color-border)] p-3 active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{job.company}</p>
                      <p className="truncate text-xs text-[var(--color-text-dim)]">{job.role}</p>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <button
                        onClick={() => onEdit(job)}
                        className="rounded p-1 text-[var(--color-text-faint)] hover:bg-[var(--color-surface-3)] hover:text-white"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(job.id)}
                        className="rounded p-1 text-[var(--color-text-faint)] hover:bg-red-950/50 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--color-text-faint)]">
                    <span>{formatFriendlyDate(job.appliedDate)}</span>
                    {job.jobLink && (
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-0.5 text-[var(--color-red-glow)] hover:underline"
                      >
                        Link <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              {columnJobs.length === 0 && (
                <p className="px-1 py-3 text-center text-[11px] text-[var(--color-text-faint)]">Drop here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
