import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Job, JobStatus } from "@/types";
import { JOB_STATUSES } from "@/types";
import { useResumes } from "@/store/useResumes";
import { todayKey } from "@/lib/utils";

export interface JobFormValues {
  company: string;
  role: string;
  appliedDate: string;
  resumeUsed: string;
  status: JobStatus;
  jobLink: string;
  location: string;
  notes: string;
}

const EMPTY: JobFormValues = {
  company: "",
  role: "",
  appliedDate: todayKey(),
  resumeUsed: "",
  status: "Wishlist",
  jobLink: "",
  location: "",
  notes: "",
};

export function JobFormDialog({
  open,
  onClose,
  onSubmit,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: JobFormValues) => void;
  editing?: Job | null;
}) {
  const [values, setValues] = useState<JobFormValues>(EMPTY);
  const { resumes } = useResumes();

  useEffect(() => {
    if (open) {
      setValues(
        editing
          ? {
              company: editing.company,
              role: editing.role,
              appliedDate: editing.appliedDate,
              resumeUsed: editing.resumeUsed,
              status: editing.status,
              jobLink: editing.jobLink,
              location: editing.location,
              notes: editing.notes,
            }
          : EMPTY
      );
    }
  }, [open, editing]);

  const set = <K extends keyof JobFormValues>(k: K, v: JobFormValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const canSubmit = values.company.trim().length > 0 && values.role.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} title={editing ? "Edit Application" : "Add Job Application"}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Company</Label>
            <Input
              placeholder="e.g. Google"
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
              className="mt-1.5"
              autoFocus
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              placeholder="e.g. SWE Intern"
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Applied Date</Label>
            <Input
              type="date"
              value={values.appliedDate}
              onChange={(e) => set("appliedDate", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={values.status} onChange={(e) => set("status", e.target.value as JobStatus)} className="mt-1.5">
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>Resume Used</Label>
          <Select value={values.resumeUsed} onChange={(e) => set("resumeUsed", e.target.value)} className="mt-1.5">
            <option value="">— None selected —</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.name}>{r.name} ({r.category})</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Location</Label>
            <Input
              placeholder="e.g. Remote / Bangalore"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Job Link</Label>
            <Input
              placeholder="https://..."
              value={values.jobLink}
              onChange={(e) => set("jobLink", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label>Notes</Label>
          <Textarea
            placeholder="Referral, recruiter contact, round details..."
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!canSubmit} onClick={() => onSubmit(values)}>
            {editing ? "Save Changes" : "Add Application"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
