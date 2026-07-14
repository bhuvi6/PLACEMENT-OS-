import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { DSAProblem, Difficulty, Platform } from "@/types";
import { todayKey } from "@/lib/utils";

const PLATFORMS: Platform[] = [
  "LeetCode",
  "Codeforces",
  "GeeksforGeeks",
  "HackerRank",
  "InterviewBit",
  "CodeChef",
  "Other",
];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export interface DSAFormValues {
  name: string;
  platform: Platform;
  difficulty: Difficulty;
  topic: string;
  solvedAlone: boolean;
  neededHint: boolean;
  neededSolution: boolean;
  notes: string;
  dateSolved: string;
}

const EMPTY: DSAFormValues = {
  name: "",
  platform: "LeetCode",
  difficulty: "Medium",
  topic: "",
  solvedAlone: true,
  neededHint: false,
  neededSolution: false,
  notes: "",
  dateSolved: todayKey(),
};

export function DSAFormDialog({
  open,
  onClose,
  onSubmit,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: DSAFormValues) => void;
  editing?: DSAProblem | null;
}) {
  const [values, setValues] = useState<DSAFormValues>(EMPTY);

  useEffect(() => {
    if (open) {
      setValues(
        editing
          ? {
              name: editing.name,
              platform: editing.platform,
              difficulty: editing.difficulty,
              topic: editing.topic,
              solvedAlone: editing.solvedAlone,
              neededHint: editing.neededHint,
              neededSolution: editing.neededSolution,
              notes: editing.notes,
              dateSolved: editing.dateSolved,
            }
          : EMPTY
      );
    }
  }, [open, editing]);

  const set = <K extends keyof DSAFormValues>(k: K, v: DSAFormValues[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const canSubmit = values.name.trim().length > 0 && values.topic.trim().length > 0;

  return (
    <Dialog open={open} onClose={onClose} title={editing ? "Edit Problem" : "Add DSA Problem"}>
      <div className="space-y-4">
        <div>
          <Label>Problem Name</Label>
          <Input
            placeholder="e.g. Two Sum"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1.5"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Platform</Label>
            <Select value={values.platform} onChange={(e) => set("platform", e.target.value as Platform)} className="mt-1.5">
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select value={values.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)} className="mt-1.5">
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Topic</Label>
            <Input
              placeholder="e.g. Arrays, DP"
              value={values.topic}
              onChange={(e) => set("topic", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Date Solved</Label>
            <Input
              type="date"
              value={values.dateSolved}
              onChange={(e) => set("dateSolved", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <ToggleRow
            label="Solved alone"
            checked={values.solvedAlone}
            onChange={(v) => set("solvedAlone", v)}
          />
          <ToggleRow
            label="Needed a hint"
            checked={values.neededHint}
            onChange={(v) => set("neededHint", v)}
          />
          <ToggleRow
            label="Needed full solution"
            checked={values.neededSolution}
            onChange={(v) => set("neededSolution", v)}
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            placeholder="Approach, complexity, gotchas..."
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!canSubmit} onClick={() => onSubmit(values)}>
            {editing ? "Save Changes" : "Add Problem"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-text)]">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
