"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Dumbbell,
  Flame,
  HeartPulse,
  Salad,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { useAuthStore } from "@/store/useAuthStore";

const features = [
  {
    icon: Flame,
    title: "Science-Backed TDEE",
    desc: "We calculate your daily energy expenditure with the Mifflin-St Jeor equation and a 30/40/30 macro split — no guesswork, just precision.",
    points: ["Mifflin-St Jeor BMR", "Activity-adjusted TDEE", "Protein · Carbs · Fat targets"],
  },
  {
    icon: Dumbbell,
    title: "AI Workout Generation",
    desc: "Describe your goal and our AI builds a personalized session — exercises, sets, reps, target muscles, and form cues in seconds.",
    points: ["Tailored to your biometrics", "Sets, reps & form tips", "5–8 exercises per session"],
  },
  {
    icon: Salad,
    title: "Instant Meal Analysis",
    desc: "Type what you ate and get instant calorie and macro estimates, ingredient breakdown, and a practical nutrition tip.",
    points: ["Calorie & macro estimate", "Ingredient detection", "Smart nutrition notes"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Landing() {
  const { setView, isAuthenticated, user } = useAuthStore();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="nf-glass-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <Sparkles className="size-4" />
              AI-Powered Health &amp; Nutrition
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Your body, decoded by{" "}
            <span className="nf-text-gradient">intelligence</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            NutriFit turns your biometrics into precise daily targets, generates
            AI workouts, and analyzes your meals — all wrapped in a calm,
            glassmorphic experience.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() =>
                setView(isAuthenticated && user?.onboardingDone ? "dashboard" : "auth")
              }
              className="nf-btn-gradient w-full border-0 sm:w-auto"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto"
            >
              Explore Features
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <HeartPulse className="size-4 text-brand-teal" /> No credit card
            </span>
            <span className="flex items-center gap-2">
              <Brain className="size-4 text-brand-emerald" /> AI-generated plans
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="size-4 text-brand-cyan" /> Real science
            </span>
          </motion.div>
        </motion.div>

        {/* Hero stat preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="nf-glass grid grid-cols-2 gap-4 rounded-3xl p-6 sm:grid-cols-4 sm:p-8">
            {[
              { label: "Daily Target", value: "2,184", unit: "kcal" },
              { label: "Protein", value: "164", unit: "g" },
              { label: "Carbs", value: "218", unit: "g" },
              { label: "Fat", value: "73", unit: "g" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold nf-text-gradient sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.unit}
                </div>
                <div className="mt-2 text-sm text-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features — alternating */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="nf-text-gradient">fuel progress</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three pillars working together to keep your nutrition and training
            on rails.
          </p>
        </div>

        <div className="mt-14 space-y-16 sm:space-y-24">
          {features.map((f, i) => {
            const Icon = f.icon;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className={`grid items-center gap-8 sm:grid-cols-2 sm:gap-12 ${
                  reversed ? "sm:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl nf-glass-soft">
                    <Icon className="size-6 text-brand-teal" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">{f.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <span className="size-1.5 rounded-full bg-brand-emerald" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="nf-glass relative aspect-[4/3] overflow-hidden rounded-3xl p-6">
                  <div className="absolute inset-0 opacity-70">
                    <div className="absolute -left-10 top-1/4 size-40 rounded-full bg-brand-cyan/30 blur-3xl" />
                    <div className="absolute -right-8 bottom-1/4 size-44 rounded-full bg-brand-emerald/30 blur-3xl" />
                  </div>
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Icon className="size-7 text-brand-teal" />
                      <span className="rounded-full nf-glass-soft px-3 py-1 text-xs font-medium">
                        Live demo
                      </span>
                    </div>
                    <div>
                      <div className="text-4xl font-bold">{f.points[0]}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {f.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="nf-glass relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <div className="absolute -left-16 -top-16 size-56 rounded-full bg-brand-cyan/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 size-56 rounded-full bg-brand-emerald/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start your transformation today
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Join NutriFit and let AI handle the math while you focus on showing
              up.
            </p>
            <Button
              size="lg"
              onClick={() => setView("auth")}
              className="nf-btn-gradient mt-8 border-0"
            >
              Create your free account
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="mt-auto border-t border-white/40 py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          NutriFit — Precision nutrition, powered by AI.
        </div>
      </footer>
    </div>
  );
}
