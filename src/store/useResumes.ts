import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ResumeFile, ResumeCategory } from "@/types";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "pos_resumes_v1";

export function useResumes() {
  const [resumes, setResumes] = useLocalStorage<ResumeFile[]>(
    STORAGE_KEY,
    []
  );

  const addResume = (data: {
    name: string;
    fileName: string;
    category: ResumeCategory;
    dataUrl: string;
    sizeBytes: number;
  }) => {
    const newResume: ResumeFile = {
      ...data,
      id: uid(),
      uploadedAt: new Date().toISOString(),
    };
    setResumes((prev) => [newResume, ...prev]);
    return newResume;
  };

  const renameResume = (id: string, name: string) => {
    setResumes((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const recategorize = (id: string, category: ResumeCategory) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, category } : r))
    );
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return { resumes, addResume, renameResume, recategorize, deleteResume };
}
