import { useState } from "react";
import API from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";
import {
  Apple,
  Utensils,
  Flame,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const quickPrompts = [
  "2 eggs and toast with butter",
  "Chicken salad bowl with avocado",
  "Protein shake with banana and oats",
  "Pasta with marinara sauce",
  "Grilled salmon with brown rice",
  "Greek yogurt with honey and berries",
];

export default function NutritionTab() {
  const { user } = useAuthStore();
  const targetCalories = user?.targetCalories || 2200;
  const macros = user?.macros || { protein: 165, carbs: 220, fat: 73 };
  const dietPreference = user?.dietPreference || "Standard Balanced";

  const [mealInput, setMealInput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  const analyzeMeal = async (e) => {
    e.preventDefault();
    if (!mealInput.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    setSaved(false);

    try {
      const res = await API.post("/ai/analyze-meal", { mealDescription: mealInput });
      setAnalysis(res.data.analysis);
      setHistory((prev) => [{ input: mealInput, ...res.data.analysis }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to analyze meal");
    } finally {
      setLoading(false);
    }
  };

  const saveToLog = async () => {
    if (!analysis) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      await API.post("/user/log", {
        date: today,
        calories: analysis.calories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fat: analysis.fat,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save to daily log");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* TOP BANNER */}
      <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white border border-emerald-100 text-emerald-600 rounded-2xl shadow-xs">
            <Apple size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              AI Meal Analyzer
            </h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">
              Describe what you ate, get instant macro breakdowns
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-black text-emerald-700 uppercase tracking-wider shadow-xs">
          <ShieldCheck size={16} /> {dietPreference}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: MEAL INPUT */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/5 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-black text-lg tracking-tight mb-3">
              <Utensils size={20} className="text-teal-500" />
              <span>Describe Your Meal</span>
            </div>

            <form onSubmit={analyzeMeal} className="space-y-3">
              <textarea
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 transition-all resize-none"
                placeholder="I ate 2 scrambled eggs with cheese, 2 slices of whole wheat toast with butter, and a glass of orange juice..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !mealInput.trim()}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles size={16} /> Analyze Meal</>
                )}
              </button>
            </form>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setMealInput(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 text-xs font-bold transition-all border border-slate-100 hover:border-emerald-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/5 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-900 tracking-tight">Analysis Results</h4>
                <button
                  onClick={saveToLog}
                  disabled={saved}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    saved
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:opacity-95"
                  }`}
                >
                  <CheckCircle size={14} />
                  {saved ? "Saved!" : "Save to Daily Log"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Calories", value: analysis.calories, unit: "kcal", target: targetCalories, pct: Math.round((analysis.calories / targetCalories) * 100) },
                  { label: "Protein", value: analysis.protein, unit: "g", target: macros.protein, pct: Math.round((analysis.protein / macros.protein) * 100) },
                  { label: "Carbs", value: analysis.carbs, unit: "g", target: macros.carbs, pct: Math.round((analysis.carbs / macros.carbs) * 100) },
                  { label: "Fat", value: analysis.fat, unit: "g", target: macros.fat, pct: Math.round((analysis.fat / macros.fat) * 100) },
                ].map((macro) => (
                  <div key={macro.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{macro.label}</span>
                    <span className="text-xl font-mono font-black text-slate-900 block">{macro.value}</span>
                    <span className="text-[10px] text-slate-400">{macro.unit}</span>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${Math.min(macro.pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400">{macro.pct}% of target</span>
                  </div>
                ))}
              </div>

              {analysis.tip && (
                <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800 font-semibold leading-relaxed">{analysis.tip}</p>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/5 space-y-4">
              <h4 className="text-base font-black text-slate-800 tracking-tight">Recent Analyses</h4>
              <div className="space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-sm text-slate-700 font-bold truncate max-w-[200px]">{item.input}</p>
                    <div className="flex gap-3 text-xs text-slate-500 font-semibold">
                      <span>{item.calories} kcal</span>
                      <span>P: {item.protein}g</span>
                      <span>C: {item.carbs}g</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: TARGET MACROS */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/5 space-y-6">
          <div className="flex items-center gap-2.5">
            <HeartPulse size={20} className="text-cyan-500" />
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Target Matrix Distribution
            </h3>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500 animate-pulse" size={20} />
              <span className="text-sm font-black text-slate-500 uppercase tracking-wide">Total Budget:</span>
            </div>
            <span className="text-xl font-mono font-black text-slate-900">{targetCalories} kcal</span>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="flex justify-between items-center px-4 py-3 bg-emerald-50/40 rounded-xl border border-emerald-100/30">
              <span className="text-sm font-bold text-slate-600">Protein Target</span>
              <span className="text-base font-mono font-black text-emerald-700">{macros.protein}g</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-teal-50/40 rounded-xl border border-teal-100/30">
              <span className="text-sm font-bold text-slate-600">Carbohydrate Target</span>
              <span className="text-base font-mono font-black text-teal-700">{macros.carbs}g</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-cyan-50/40 rounded-xl border border-cyan-100/30">
              <span className="text-sm font-bold text-slate-600">Fat Target</span>
              <span className="text-base font-mono font-black text-cyan-700">{macros.fat}g</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-400 leading-relaxed">
              Use the AI Meal Analyzer to get instant macro breakdowns from natural language descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
