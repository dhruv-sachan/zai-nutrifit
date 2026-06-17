"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Beef,
  Dumbbell,
  Droplet,
  Flame,
  Loader2,
  Salad,
  Sparkles,
  Target,
  Utensils,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "./Navbar";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import type { Exercise, MealEstimate } from "@/lib/types";

const FOCUSES = [
  "Full body strength",
  "Fat burn cardio",
  "Core & abs",
  "Upper body",
  "Lower body",
];

export function Dashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const profile = user?.profile ?? null;

  const [focus, setFocus] = useState("Full body strength");
  const [duration, setDuration] = useState("45");
  const [genLoading, setGenLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  const [meal, setMeal] = useState("");
  const [mealLoading, setMealLoading] = useState(false);
  const [estimate, setEstimate] = useState<MealEstimate | null>(null);

  async function handleGenerateWorkout() {
    setGenLoading(true);
    setExercises(null);
    try {
      const { exercises } = await api.generateWorkout(
        focus,
        Number(duration) || 45
      );
      setExercises(exercises);
      toast({
        title: "Workout generated",
        description: `${exercises.length} exercises ready for you.`,
      });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenLoading(false);
    }
  }

  async function handleAnalyzeMeal() {
    if (meal.trim().length < 2) return;
    setMealLoading(true);
    setEstimate(null);
    try {
      const { estimate } = await api.analyzeMeal(meal.trim());
      setEstimate(estimate);
      toast({
        title: "Meal analyzed",
        description: `~${estimate.calories} kcal estimated.`,
      });
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setMealLoading(false);
    }
  }

  const metrics = [
    {
      label: "Daily Target (TDEE)",
      value: profile?.targetCalories ?? 0,
      unit: "kcal",
      icon: Flame,
      tint: "text-orange-500",
      ring: "from-orange-400/30",
    },
    {
      label: "Protein",
      value: profile?.macros?.protein ?? 0,
      unit: "g",
      icon: Beef,
      tint: "text-rose-500",
      ring: "from-rose-400/30",
    },
    {
      label: "Carbs",
      value: profile?.macros?.carbs ?? 0,
      unit: "g",
      icon: Wheat,
      tint: "text-amber-500",
      ring: "from-amber-400/30",
    },
    {
      label: "Fats",
      value: profile?.macros?.fat ?? 0,
      unit: "g",
      icon: Droplet,
      tint: "text-sky-500",
      ring: "from-sky-400/30",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{today}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Hello, {user?.name?.split(" ")[0] ?? "athlete"}{" "}
              <span className="nf-text-gradient">👋</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here&apos;s your personalized nutrition blueprint.
            </p>
          </div>
          <div className="nf-glass-soft flex items-center gap-2 rounded-xl px-4 py-2 text-sm">
            <Target className="size-4 text-brand-teal" />
            <span className="text-muted-foreground">Goal:</span>
            <span className="font-medium capitalize">
              {profile?.dietPreference?.replace("_", " ") ?? "—"}
            </span>
          </div>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i, ease: "easeOut" }}
                className="nf-glass relative overflow-hidden rounded-2xl p-5"
              >
                <div
                  className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${m.ring} to-transparent blur-2xl`}
                />
                <div className="relative flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl nf-glass-soft">
                    <Icon className={`size-5 ${m.tint}`} />
                  </span>
                </div>
                <div className="relative mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">
                      {m.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {m.unit}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Body composition strip */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="nf-glass mt-5 grid grid-cols-2 gap-4 rounded-2xl p-5 sm:grid-cols-4"
          >
            {[
              { k: "Age", v: `${profile.age} yrs` },
              { k: "Height", v: `${profile.heightCm} cm` },
              { k: "Weight", v: `${profile.weightKg} kg` },
              { k: "Step Goal", v: profile.stepGoal.toLocaleString() },
            ].map((s) => (
              <div key={s.k}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.k}
                </div>
                <div className="mt-1 text-lg font-semibold">{s.v}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* AI Launchpad */}
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="size-5 text-brand-teal" />
            <h2 className="text-2xl font-bold tracking-tight">AI Launchpad</h2>
            <span className="nf-glass-soft ml-2 rounded-full px-3 py-0.5 text-xs font-medium">
              Powered by Gemini
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Workout Generator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="nf-glass flex flex-col rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl nf-btn-gradient">
                  <Dumbbell className="size-5 text-white" />
                </span>
                <div>
                  <h3 className="font-semibold">Workout Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-built session in seconds.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Session Focus</Label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUSES.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFocus(f)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          focus === f
                            ? "nf-btn-gradient border-0"
                            : "nf-glass-soft text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={10}
                    max={120}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="max-w-[140px]"
                  />
                </div>

                <Button
                  onClick={handleGenerateWorkout}
                  disabled={genLoading}
                  className="nf-glow nf-btn-gradient w-full border-0"
                >
                  {genLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Generate Workout
                    </>
                  )}
                </Button>
              </div>

              {exercises && (
                <div className="nf-scroll mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                  {exercises.map((ex, idx) => (
                    <motion.div
                      key={`${ex.id}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="nf-glass-soft rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-lg bg-white/60 text-xs font-bold text-brand-teal">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{ex.name}</span>
                        </div>
                        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium text-foreground/70">
                          {ex.target}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{ex.sets} sets</span>
                        <span>·</span>
                        <span>{ex.reps} reps</span>
                      </div>
                      <p className="mt-1.5 text-xs text-foreground/70">
                        {ex.form}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Meal Analyzer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="nf-glass flex flex-col rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl nf-btn-gradient">
                  <Salad className="size-5 text-white" />
                </span>
                <div>
                  <h3 className="font-semibold">Meal Analyzer</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant calorie &amp; macro estimate.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="meal">Describe your meal</Label>
                  <Textarea
                    id="meal"
                    placeholder="e.g. Grilled chicken breast with brown rice, broccoli and a drizzle of olive oil"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleAnalyzeMeal}
                  disabled={mealLoading || meal.trim().length < 2}
                  className="nf-glow nf-btn-gradient w-full border-0"
                >
                  {mealLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Utensils className="size-4" />
                      Analyze Meal
                    </>
                  )}
                </Button>
              </div>

              {estimate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="nf-glass-soft mt-4 rounded-xl p-4"
                >
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { k: "Cal", v: estimate.calories, c: "text-orange-500" },
                      { k: "Protein", v: `${estimate.protein}g`, c: "text-rose-500" },
                      { k: "Carbs", v: `${estimate.carbs}g`, c: "text-amber-500" },
                      { k: "Fat", v: `${estimate.fat}g`, c: "text-sky-500" },
                    ].map((s) => (
                      <div key={s.k}>
                        <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
                        <div className="text-xs text-muted-foreground">{s.k}</div>
                      </div>
                    ))}
                  </div>
                  {estimate.items && estimate.items.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {estimate.items.map((it, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white/60 px-2 py-0.5 text-xs text-foreground/70"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  )}
                  {estimate.notes && (
                    <p className="mt-3 border-t border-white/50 pt-2 text-xs text-muted-foreground">
                      💡 {estimate.notes}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-white/40 py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          NutriFit — Your AI health companion. Targets are estimates; consult a
          professional for medical advice.
        </div>
      </footer>
    </div>
  );
}
