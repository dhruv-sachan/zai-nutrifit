import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";
import {
  Flame,
  Sparkles,
  ChevronRight,
  ClipboardList,
  PlusCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

// Helper Component for the visual Macro Bars
const MacroBar = ({ label, current, target, colorClass, bgClass }) => {
  const percent = Math.min(Math.round((current / target) * 100) || 0, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black text-slate-700">{label}</span>
        <span className="font-bold text-slate-400">{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
        {current}g / {target}g
      </p>
    </div>
  );
};

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

  // State for the Data Entry Form (Moved to the bottom)
  const [logForm, setLogForm] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    steps: "",
  });
  const [isLogging, setIsLogging] = useState(false);

  // Calorie Ring Calculations
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference -
    (Math.min(loggedData.calories, targetCalories) / targetCalories) *
      ringCircumference;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* ROW 1: Hero Intelligence & User Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The Hero Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Good Evening, {user?.name ? user.name.split(" ")[0] : "Operator"}{" "}
              <span className="text-2xl">👋</span>
            </h2>
            <div className="flex items-center gap-3 mt-4 text-sm font-bold">
              <span className="text-slate-400 uppercase tracking-widest">
                Health Score:
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg">
                87 Optimal
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <p className="text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Protein Goal: On Track
              </p>
              <p className="text-amber-400 font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> Hydration: Slightly Low
              </p>
            </div>

            <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95">
              <Sparkles size={16} className="text-cyan-600" /> Ask AI Copilot
            </button>
          </div>
        </div>

        {/* User / Streak Card */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {user?.name || "Daniel Reeve"}
            </p>
            <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
              Goal: {user?.profile?.goal || "Fat Loss"}
            </p>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Week 3 Phase
            </p>
          </div>

          <div className="mt-6 bg-orange-50 border border-orange-100/50 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-500 shrink-0">
              <Flame size={24} className="fill-orange-500" />
            </div>
            <div>
              <p className="font-black text-orange-700 text-lg leading-none">
                12 Day Streak
              </p>
              <p className="text-xs font-bold text-orange-500/80 mt-1">
                Logged meals for 12 consecutive days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Contextual Metrics (Ring + Macros + Insight) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contextual Calorie Ring */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Today's Calories
          </p>

          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {loggedData.calories}
                </span>
                <span className="text-sm font-bold text-slate-400">kcal</span>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                Target: {targetCalories} kcal
              </p>
            </div>

            {/* SVG Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={ringRadius}
                  stroke="url(#calorieGradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
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
                </defs>
              </svg>
              <Flame
                size={20}
                className="absolute text-cyan-500 animate-pulse"
              />
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-5">
          <MacroBar
            label="Protein"
            current={loggedData.protein}
            target={macros.protein}
            colorClass="bg-cyan-500"
          />
          <MacroBar
            label="Carbs"
            current={loggedData.carbs}
            target={macros.carbs}
            colorClass="bg-emerald-500"
          />
          <MacroBar
            label="Fat"
            current={loggedData.fat}
            target={macros.fat}
            colorClass="bg-amber-400"
          />
        </div>

        {/* Visible AI Insight */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 font-black mb-3">
              <Sparkles size={18} /> AI Insight
            </div>
            <p className="text-base font-semibold text-slate-700 leading-relaxed">
              You are currently{" "}
              <span className="font-black text-cyan-700">
                {macros.protein - loggedData.protein}g below
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
        </div>
      </div>

      {/* ROW 3: The Demoted Logging Form */}
      <div className="mt-12 pt-8 border-t border-slate-200/60">
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

        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          {/* Minimal 1-row form design to save space */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <input
              type="number"
              placeholder="Steps"
              className="col-span-2 md:col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Kcal"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button className="col-span-2 md:col-span-1 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
              <PlusCircle size={16} /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
