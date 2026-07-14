// ===== Daily Tracker =====
export type Mood = "terrible" | "low" | "okay" | "good" | "great";

export interface DailyEntry {
  date: string; // yyyy-MM-dd, unique key
  // Morning check-in
  sleepHours: number | null;
  mood: Mood | null;
  energy: number | null; // 1-10
  morningCompletedAt: string | null;
  // Night check-in
  productivity: number | null; // 1-10
  reflection: string;
  waterLiters: number | null;
  steps: number | null;
  workoutDone: boolean;
  workoutType: string;
  nightCompletedAt: string | null;
  updatedAt: string;
}

// ===== DSA Tracker =====
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform =
  | "LeetCode"
  | "Codeforces"
  | "GeeksforGeeks"
  | "HackerRank"
  | "InterviewBit"
  | "CodeChef"
  | "Other";

export interface DSAProblem {
  id: string;
  name: string;
  platform: Platform;
  difficulty: Difficulty;
  topic: string;
  solvedAlone: boolean;
  neededHint: boolean;
  neededSolution: boolean;
  notes: string;
  dateSolved: string; // yyyy-MM-dd
  createdAt: string;
  updatedAt: string;
}

// ===== Job Tracker =====
export type JobStatus =
  | "Wishlist"
  | "Applied"
  | "OA"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface Job {
  id: string;
  company: string;
  role: string;
  appliedDate: string; // yyyy-MM-dd
  resumeUsed: string; // resume id or free text label
  status: JobStatus;
  jobLink: string;
  location: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const JOB_STATUSES: JobStatus[] = [
  "Wishlist",
  "Applied",
  "OA",
  "Interview",
  "Offer",
  "Rejected",
];

// ===== Resume Vault =====
export type ResumeCategory =
  | "SDE"
  | "AI"
  | "GenAI"
  | "Frontend"
  | "Backend"
  | "ML";

export const RESUME_CATEGORIES: ResumeCategory[] = [
  "SDE",
  "AI",
  "GenAI",
  "Frontend",
  "Backend",
  "ML",
];

export interface ResumeFile {
  id: string;
  name: string; // display name (renameable)
  fileName: string; // original file name
  category: ResumeCategory;
  dataUrl: string; // base64 encoded PDF
  sizeBytes: number;
  uploadedAt: string;
}
