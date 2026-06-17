"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatedNumber } from "./AnimatedNumber";
import { staggerContainer, riseItem } from "./motion";
import {
  Flame,
  Sparkles,
  ClipboardList,
  PlusCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

// Elevated Macro Bar — animated fill width, gradient + glow, count-up grams
function MacroBar({
  label,
  current,
  target,
  gradient,
  glow,
  delay = 0,
}: {
  label: string;
  current: number;
  target: number;
  gradient: string;
  glow: string;
  delay?: number;
}) {
  const percent = Math.min(Math.round((current / target) * 100) || 0, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black text-slate-700 tracking-tight">{label}</span>
        <span className="font-bold text-slate-400 nf-stat">{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100/80 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${gradient}`}
          style={{ boxShadow: glow }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[11px] font-bold text-slate-500 nf-stat">
          <AnimatedNumber
            value={current}
            format={(n) => Math.round(n).toString()}
            suffix="g"
          />{" "}
          / {target}g
        </span>
      </div>
    </div>
  );
}

export default function OverviewTab() {
  const { user } = useAuthStore();

  const targetCalories = user?.targetCalories || 2459;
  const macros = user?.macros || { protein: 200, carbs: 300, fat: 100 };

  // State for logged data (simulated for the dashboard view)
  const [loggedData, setLoggedData] = useState({
    calories: 1800,
    protein: 158,
    carbs: 246,
    fat: 82,
    steps: 8400,
  });

  // State for the Data Entry Form
  const [logForm, setLogForm] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    steps: "",
  });
  const [isLogging, setIsLogging] = useState(false);
  const [logError, setLogError] = useState("");
  const [logSaved, setLogSaved] = useState(false);

  // Calorie Ring Calculations
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference -
    (Math.min(loggedData.calories, targetCalories) / targetCalories) *
      ringCircumference;
  const ringPercent = Math.round(
    (Math.min(loggedData.calories, targetCalories) / targetCalories) * 100,
  );

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    setLogError("");
    setLogSaved(false);

    const today = new Date().toISOString().split("T")[0];
    const payload = {
      date: today,
      calories: Number(logForm.calories) || 0,
      protein: Number(logForm.protein) || 0,
      carbs: Number(logForm.carbs) || 0,
      fat: Number(logForm.fat) || 0,
      steps: Number(logForm.steps) || 0,
    };

    try {
      await api.saveLog(payload);
      // Update the dashboard view live
      setLoggedData((prev) => ({
        ...prev,
        calories: payload.calories || prev.calories,
        protein: payload.protein || prev.protein,
        carbs: payload.carbs || prev.carbs,
        fat: payload.fat || prev.fat,
        steps: payload.steps || prev.steps,
      }));
      setLogForm({ calories: "", protein: "", carbs: "", fat: "", steps: "" });
      setLogSaved(true);
      setTimeout(() => setLogSaved(false), 3000);
    } catch (err) {
      setLogError(
        err instanceof Error ? err.message : "Failed to commit log to cluster.",
      );
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* ROW 1: Hero Intelligence & User Streak */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* The Hero Card — dark, grain, aurora border, floating orbs */}
        <motion.div
          variants={riseItem}
          whileHover={{ y: -4 }}
          className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative flex flex-col justify-between nf-grain nf-aurora-border"
        >
          {/* Floating orbs (clipped to card) */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <motion.div
              className="nf-orb"
              style={{
                width: 240,
                height: 240,
                top: "-70px",
                right: "-50px",
                opacity: 0.7,
                background:
                  "radial-gradient(circle at 30% 30%, oklch(0.7 0.16 200), transparent 70%)",
              }}
              animate={{ x: [0, 18, 0], y: [0, 14, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="nf-orb"
              style={{
                width: 200,
                height: 200,
                bottom: "-60px",
                left: "18%",
                opacity: 0.6,
                background:
                  "radial-gradient(circle at 50% 50%, oklch(0.78 0.16 150), transparent 70%)",
              }}
              animate={{ x: [0, -16, 0], y: [0, -12, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Good Evening,{" "}
              {user?.name ? user.name.split(" ")[0] : "Operator"}{" "}
              <span className="text-2xl">👋</span>
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Health Score
              </span>
              <motion.span
                className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 ring-1 ring-emerald-400/30"
                animate={{
                  boxShadow: [
                    "0 0 0 0 oklch(0.78 0.16 150 / 0)",
                    "0 0 22px 2px oklch(0.78 0.16 150 / 0.5)",
                    "0 0 0 0 oklch(0.78 0.16 150 / 0)",
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatedNumber value={87} className="nf-stat font-black text-sm" />
                <span className="text-emerald-400/80 text-xs font-bold">Optimal</span>
              </motion.span>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <p className="text-emerald-400 font-bold flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} /> Protein Goal: On Track
              </p>
              <p className="text-amber-400 font-bold flex items-center gap-2 text-sm">
                <ShieldAlert size={16} /> Hydration: Slightly Low
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="nf-btn-gradient nf-shimmer relative overflow-hidden px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2"
            >
              <Sparkles size={16} /> Ask AI Copilot
            </motion.button>
          </div>
        </motion.div>

        {/* User / Streak Card */}
        <motion.div
          variants={riseItem}
          whileHover={{ y: -4 }}
          className="nf-premium rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {user?.name || "Daniel Reeve"}
            </p>
            <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
              Goal: <span className="nf-text-gradient">{user?.goal || "Fat Loss"}</span>
            </p>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Week 3 Phase
            </p>
          </div>

          <div className="mt-6 bg-orange-50/80 border border-orange-100/60 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-500 shrink-0">
              <Flame size={24} className="fill-orange-500" />
            </div>
            <div>
              <p className="font-black text-orange-700 text-lg leading-none">
                <AnimatedNumber value={12} className="nf-stat" /> Day Streak
              </p>
              <p className="text-xs font-bold text-orange-500/80 mt-1">
                Logged meals for 12 consecutive days.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ROW 2: Contextual Metrics (Ring + Macros + Insight) */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Contextual Calorie Ring */}
        <motion.div
          variants={riseItem}
          whileHover={{ y: -4 }}
          className="nf-premium rounded-3xl p-6 flex flex-col justify-between"
        >
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Today&apos;s Calories
          </p>

          <div className="flex items-center justify-center my-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  stroke="#eef2f7"
                  strokeWidth="10"
                  fill="transparent"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  stroke="url(#calorieGradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeLinecap="round"
                  filter="url(#ringGlow)"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="calorieGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatedNumber
                  value={loggedData.calories}
                  format={(n) => Math.round(n).toLocaleString()}
                  className="nf-stat text-3xl font-black text-slate-800"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                  kcal
                </span>
                <span className="text-[10px] font-bold text-cyan-600 mt-0.5 nf-stat">
                  {ringPercent}% of target
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100/80">
            <span className="font-black text-slate-400 uppercase tracking-widest">
              Target
            </span>
            <AnimatedNumber
              value={targetCalories}
              format={(n) => Math.round(n).toLocaleString()}
              suffix=" kcal"
              className="nf-stat font-black text-slate-700"
            />
          </div>
        </motion.div>

        {/* Macro Progress Bars */}
        <motion.div
          variants={riseItem}
          whileHover={{ y: -4 }}
          className="nf-premium rounded-3xl p-6 flex flex-col justify-center space-y-5"
        >
          <MacroBar
            label="Protein"
            current={loggedData.protein}
            target={macros.protein}
            gradient="bg-gradient-to-r from-rose-400 to-rose-500"
            glow="0 0 12px oklch(0.65 0.2 15 / 0.45)"
            delay={0.1}
          />
          <MacroBar
            label="Carbs"
            current={loggedData.carbs}
            target={macros.carbs}
            gradient="bg-gradient-to-r from-amber-300 to-amber-500"
            glow="0 0 12px oklch(0.78 0.16 75 / 0.45)"
            delay={0.2}
          />
          <MacroBar
            label="Fat"
            current={loggedData.fat}
            target={macros.fat}
            gradient="bg-gradient-to-r from-sky-400 to-sky-500"
            glow="0 0 12px oklch(0.65 0.14 230 / 0.45)"
            delay={0.3}
          />
        </motion.div>

        {/* Visible AI Insight */}
        <motion.div
          variants={riseItem}
          whileHover={{ y: -4 }}
          className="rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100/60 shadow-xl shadow-cyan-200/30 backdrop-blur-xl"
        >
          <div>
            <div className="flex items-center gap-2 text-cyan-700 font-black mb-3">
              <Sparkles size={18} /> AI Insight
            </div>
            <p className="text-base font-semibold text-slate-700 leading-relaxed">
              You are currently{" "}
              <span className="font-black text-cyan-700">
                <AnimatedNumber
                  value={Math.max(macros.protein - loggedData.protein, 0)}
                  suffix="g"
                  className="nf-stat"
                />{" "}
                below
              </span>{" "}
              your protein target.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-black text-cyan-700/70 uppercase tracking-widest mb-2">
              Suggested Fillers:
            </p>
            <ul className="space-y-1.5 text-sm font-bold text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Greek
                Yogurt (20g)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> 3
                Hardboiled Eggs (18g)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Grilled
                Chicken Breast (30g)
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* ROW 3: The Demoted Logging Form */}
      <motion.div variants={riseItem} className="pt-8 border-t border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
            <ClipboardList size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Manual Log Parameters
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Commit raw daily metrics to the database
            </p>
          </div>
        </div>

        <motion.div
          variants={riseItem}
          whileHover={{ y: -2 }}
          className="nf-premium rounded-3xl p-6"
        >
          {logError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <ShieldAlert size={14} /> {logError}
            </div>
          )}
          {logSaved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={14} /> Daily log committed to cluster.
            </div>
          )}

          <form
            onSubmit={handleSaveLog}
            className="grid grid-cols-2 md:grid-cols-6 gap-4"
          >
            <input
              type="number"
              placeholder="Steps"
              value={logForm.steps}
              onChange={(e) =>
                setLogForm({ ...logForm, steps: e.target.value })
              }
              className="col-span-2 md:col-span-1 bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="number"
              placeholder="Kcal"
              value={logForm.calories}
              onChange={(e) =>
                setLogForm({ ...logForm, calories: e.target.value })
              }
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={logForm.protein}
              onChange={(e) =>
                setLogForm({ ...logForm, protein: e.target.value })
              }
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={logForm.carbs}
              onChange={(e) =>
                setLogForm({ ...logForm, carbs: e.target.value })
              }
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="number"
              placeholder="Fat (g)"
              value={logForm.fat}
              onChange={(e) => setLogForm({ ...logForm, fat: e.target.value })}
              className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <motion.button
              type="submit"
              disabled={isLogging}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-2 md:col-span-1 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70 nf-shimmer"
            >
              {isLogging ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving
                </>
              ) : (
                <>
                  <PlusCircle size={16} /> Save
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
