import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { DSAProblem } from "@/types";
import { uid, todayKey, isSameWeek, isSameMonth } from "@/lib/utils";

const STORAGE_KEY = "pos_dsa_problems_v1";

export type NewDSAProblem = Omit<
  DSAProblem,
  "id" | "createdAt" | "updatedAt"
>;

export function useDSAProblems() {
  const [problems, setProblems] = useLocalStorage<DSAProblem[]>(
    STORAGE_KEY,
    []
  );

  const addProblem = (data: NewDSAProblem) => {
    const now = new Date().toISOString();
    const newProblem: DSAProblem = {
      ...data,
      id: uid(),
      createdAt: now,
      updatedAt: now,
    };
    setProblems((prev) => [newProblem, ...prev]);
    return newProblem;
  };

  const updateProblem = (id: string, data: Partial<NewDSAProblem>) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };

  const today = todayKey();
  const solvedToday = problems.filter((p) => p.dateSolved === today).length;
  const solvedThisWeek = problems.filter((p) =>
    isSameWeek(p.dateSolved, today)
  ).length;
  const solvedThisMonth = problems.filter((p) =>
    isSameMonth(p.dateSolved, today)
  ).length;

  const stats = {
    total: problems.length,
    today: solvedToday,
    week: solvedThisWeek,
    month: solvedThisMonth,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
    solvedAlone: problems.filter((p) => p.solvedAlone).length,
  };

  return { problems, addProblem, updateProblem, deleteProblem, stats };
}
