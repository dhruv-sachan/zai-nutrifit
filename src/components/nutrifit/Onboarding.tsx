"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Dumbbell,
  Footprints,
  Heart,
  Leaf,
  LogOut,
  Ruler,
  Target,
  Weight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

const EXERCISES = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very_active", label: "Very Active (2x/day)" },
];

const DIETS = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High Protein" },
  { value: "low_carb", label: "Low Carb" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
];

export function Onboarding() {
  const { user, completeOnboarding, logout, setView } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [stepGoal, setStepGoal] = useState("8000");
  const [exerciseType, setExerciseType] = useState("");
  const [dietPreference, setDietPreference] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sex || !exerciseType || !dietPreference) {
      toast({
        title: "Please complete all fields",
        description: "Gender, exercise type, and diet preference are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding({
        age: Number(age),
        sex,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        stepGoal: Number(stepGoal),
        exerciseType,
        dietPreference,
      });
      toast({
        title: "Profile ready!",
        description: "Your personalized targets have been calculated.",
      });
    } catch (err) {
      toast({
        title: "Could not save profile",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 min-h-screen">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back home
        </button>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg nf-btn-gradient">
            <Activity className="size-4 text-white" />
          </span>
          <span className="font-semibold tracking-tight">
            Nutri<span className="nf-text-gradient">Fit</span>
          </span>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-12">
        {/* Left — premium frosted-glass card with hero image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="nf-glass relative hidden overflow-hidden rounded-3xl lg:block lg:min-h-[620px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(160deg, oklch(0.99 0 0 / 0.25), oklch(0.55 0.14 200 / 0.35)), url(/onboarding-hero.png)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-8">
            <span className="nf-glass-soft inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              <Heart className="size-3.5 text-brand-teal" />
              Step 1 of 1 · Biometrics
            </span>
            <div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                Let&apos;s calculate your
                <br />
                <span className="nf-text-gradient">daily blueprint.</span>
              </h2>
              <p className="mt-4 max-w-sm text-white/90">
                We use the Mifflin-St Jeor equation to compute your BMR, then
                apply a 1.55 activity factor for your TDEE and split it 30/40/30
                into protein, carbs, and fat.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["BMR", "TDEE", "Macros"].map((t) => (
                  <span
                    key={t}
                    className="nf-glass-soft rounded-full px-3 py-1 text-xs font-medium text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        >
          <div className="nf-glass rounded-3xl p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Tell us about you
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Welcome, {user?.name?.split(" ")[0] ?? "athlete"}. This powers
                every recommendation in NutriFit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField id="age" label="Age" icon={<Calendar className="size-4" />}>
                  <Input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    min={5}
                    max={120}
                    placeholder="28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pl-9"
                    required
                  />
                </FormField>

                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select value={sex} onValueChange={(v) => setSex(v as "male" | "female")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField id="height" label="Height (cm)" icon={<Ruler className="size-4" />}>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    min={80}
                    max={260}
                    placeholder="175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="pl-9"
                    required
                  />
                </FormField>

                <FormField id="weight" label="Weight (kg)" icon={<Weight className="size-4" />}>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    min={25}
                    max={400}
                    placeholder="72"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="pl-9"
                    required
                  />
                </FormField>
              </div>

              <FormField
                id="steps"
                label="Daily Step Goal"
                icon={<Footprints className="size-4" />}
              >
                <Input
                  id="steps"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100000}
                  step={500}
                  placeholder="8000"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  className="pl-9"
                  required
                />
              </FormField>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Dumbbell className="size-3.5" /> Exercise Type
                </Label>
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXERCISES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Leaf className="size-3.5" /> Diet Preference
                </Label>
                <Select value={dietPreference} onValueChange={setDietPreference}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select diet preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIETS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="nf-btn-gradient mt-2 w-full border-0"
              >
                {loading ? "Calculating…" : "Calculate My Blueprint"}
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            {/* Escape hatch */}
            <div className="mt-6 border-t border-white/50 pt-5">
              <p className="mb-2 text-xs text-muted-foreground">
                Logged into the wrong account? No worries.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sign out & switch account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
