import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sunrise, Moon, Droplets, Footprints, Dumbbell, CheckCircle2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SliderScale } from "@/components/ui/slider-scale";
import { Tabs } from "@/components/ui/tabs";
import { useDailyEntries } from "@/store/useDailyEntries";
import { useToast } from "@/components/ui/toast";
import { todayKey, formatFriendlyDate, addDays } from "@/lib/utils";
import type { Mood } from "@/types";

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "terrible", emoji: "\u{1F62B}", label: "Terrible" },
  { value: "low", emoji: "\u{1F615}", label: "Low" },
  { value: "okay", emoji: "\u{1F610}", label: "Okay" },
  { value: "good", emoji: "\u{1F642}", label: "Good" },
  { value: "great", emoji: "\u{1F525}", label: "Great" },
];

export default function DailyTracker() {
  const [params, setParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const { getEntry, saveMorningCheckIn, saveNightCheckIn } = useDailyEntries();
  const entry = getEntry(selectedDate);
  const { push } = useToast();

  const section = params.get("section") === "night" ? "night" : "morning";
  const setSection = (v: string) => {
    setParams((p) => {
      p.set("section", v);
      return p;
    });
  };

  useEffect(() => {
    if (!params.get("section")) setSection("morning");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Morning form state
  const [sleepHours, setSleepHours] = useState<string>("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);

  // Night form state
  const [productivity, setProductivity] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [water, setWater] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [workoutDone, setWorkoutDone] = useState(false);
  const [workoutType, setWorkoutType] = useState("");

  useEffect(() => {
    setSleepHours(entry.sleepHours?.toString() ?? "");
    setMood(entry.mood);
    setEnergy(entry.energy);
    setProductivity(entry.productivity);
    setReflection(entry.reflection ?? "");
    setWater(entry.waterLiters?.toString() ?? "");
    setSteps(entry.steps?.toString() ?? "");
    setWorkoutDone(entry.workoutDone);
    setWorkoutType(entry.workoutType ?? "");
  }, [selectedDate, entry.sleepHours, entry.mood, entry.energy, entry.productivity, entry.reflection, entry.waterLiters, entry.steps, entry.workoutDone, entry.workoutType]);

  const submitMorning = () => {
    if (!sleepHours || !mood || !energy) {
      push("Fill sleep hours, mood, and energy first.", "error");
      return;
    }
    saveMorningCheckIn(selectedDate, {
      sleepHours: parseFloat(sleepHours),
      mood,
      energy,
    });
    push("Morning check-in saved.");
  };

  const submitNight = () => {
    if (!productivity || !water || !steps) {
      push("Fill productivity, water, and steps first.", "error");
      return;
    }
    saveNightCheckIn(selectedDate, {
      productivity,
      reflection,
      waterLiters: parseFloat(water),
      steps: parseInt(steps, 10),
      workoutDone,
      workoutType,
    });
    push("Night check-in saved.");
  };

  const isToday = selectedDate === todayKey();

  return (
    <div>
      <Topbar title="Daily Tracker" subtitle="Two check-ins a day. Consistency wins races." />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate((d) => addDays(d, -1))}>
            ← Prev
          </Button>
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-sm font-semibold text-white">
            {formatFriendlyDate(selectedDate)} {isToday && <span className="text-[var(--color-red-glow)]">• Today</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isToday}
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
          >
            Next →
          </Button>
        </div>
        <Tabs
          value={section}
          onChange={setSection}
          tabs={[
            { value: "morning", label: "Morning", icon: <Sunrise className="h-3.5 w-3.5" /> },
            { value: "night", label: "Night", icon: <Moon className="h-3.5 w-3.5" /> },
          ]}
        />
      </div>

      {section === "morning" ? (
        <Card>
          <CardHeader>
            <CardTitle>Morning Check-In</CardTitle>
            {entry.morningCompletedAt && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Sleep (hours)</Label>
              <Input
                type="number"
                min={0}
                max={14}
                step={0.5}
                placeholder="e.g. 7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="mt-1.5 max-w-[160px]"
              />
            </div>
            <div>
              <Label>Mood</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-4 py-2.5 transition-all ${
                      mood === m.value
                        ? "border-[var(--color-red)] bg-red-950/30 shadow-[0_0_14px_-4px_rgba(225,6,0,0.6)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-hi)]"
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] font-semibold uppercase text-[var(--color-text-dim)]">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Energy (1-10)</Label>
              <SliderScale value={energy} onChange={setEnergy} className="mt-1.5" />
            </div>
            <Button onClick={submitMorning} className="w-full sm:w-auto">
              Save Morning Check-In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Night Check-In</CardTitle>
            {entry.nightCompletedAt && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Productivity (1-10)</Label>
              <SliderScale value={productivity} onChange={setProductivity} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" /> Water (liters)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.25}
                  placeholder="e.g. 2.5"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <Footprints className="h-3.5 w-3.5" /> Steps
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 8000"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5">
              <Label className="flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" /> Workout completed
              </Label>
              <Switch checked={workoutDone} onCheckedChange={setWorkoutDone} />
            </div>
            {workoutDone && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Label>Workout type</Label>
                <Input
                  placeholder="e.g. Push day, 5k run, Yoga"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="mt-1.5"
                />
              </motion.div>
            )}
            <div>
              <Label>Reflection</Label>
              <Textarea
                placeholder="What went well today? What will you change tomorrow?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button onClick={submitNight} className="w-full sm:w-auto">
              Save Night Check-In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
