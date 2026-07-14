import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Job, JobStatus } from "@/types";
import { uid, todayKey, isSameWeek } from "@/lib/utils";

const STORAGE_KEY = "pos_jobs_v1";

export type NewJob = Omit<Job, "id" | "createdAt" | "updatedAt">;

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage<Job[]>(STORAGE_KEY, []);

  const addJob = (data: NewJob) => {
    const now = new Date().toISOString();
    const newJob: Job = { ...data, id: uid(), createdAt: now, updatedAt: now };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (id: string, data: Partial<NewJob>) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, ...data, updatedAt: new Date().toISOString() } : j
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const setStatus = (id: string, status: JobStatus) => {
    updateJob(id, { status });
  };

  const today = todayKey();
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status !== "Wishlist").length,
    appliedThisWeek: jobs.filter(
      (j) => j.status !== "Wishlist" && isSameWeek(j.appliedDate, today)
    ).length,
    interviews: jobs.filter((j) => j.status === "Interview").length,
    offers: jobs.filter((j) => j.status === "Offer").length,
    oa: jobs.filter((j) => j.status === "OA").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  return { jobs, addJob, updateJob, deleteJob, setStatus, stats };
}
