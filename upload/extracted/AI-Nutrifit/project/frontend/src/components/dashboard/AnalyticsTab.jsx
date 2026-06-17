import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import { BarChart3, TrendingUp, Loader2, Calendar, Flame, Footprints } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      day: dayNames[d.getDay()],
      calories: 0,
      steps: 0,
      protein: 0,
    });
  }
  return days;
}

export default function AnalyticsTab() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyAnalytics = async () => {
      try {
        const response = await API.get("/user/logs/weekly");
        const logs = response.data || [];
        const days = getLast7Days();
        const merged = days.map((day) => {
          const log = logs.find((l) => l.date === day.date);
          return {
            ...day,
            calories: log?.calories || 0,
            steps: log?.steps || 0,
            protein: log?.protein || 0,
          };
        });
        setData(merged);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
        setData(getLast7Days());
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeeklyAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="h-60 flex flex-col justify-center items-center gap-3 text-slate-400 font-bold text-sm">
        <Loader2 className="animate-spin text-emerald-600" size={24} /> Loading Analytics Data...
      </div>
    );
  }

  const avgCalories = Math.round(data.reduce((s, d) => s + d.calories, 0) / 7);
  const avgSteps = Math.round(data.reduce((s, d) => s + d.steps, 0) / 7);
  const daysLogged = data.filter((d) => d.calories > 0).length;

  return (
    <div className="space-y-8">
      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xl shadow-slate-200/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Flame size={18} />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Avg Calories</span>
          </div>
          <p className="text-2xl font-mono font-black text-slate-900">{avgCalories}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">kcal/day</p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xl shadow-slate-200/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
              <Footprints size={18} />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Avg Steps</span>
          </div>
          <p className="text-2xl font-mono font-black text-slate-900">{avgSteps.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">steps/day</p>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xl shadow-slate-200/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <TrendingUp size={18} />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Days Logged</span>
          </div>
          <p className="text-2xl font-mono font-black text-slate-900">{daysLogged}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">of last 7</p>
        </div>
      </div>

      {/* RECHARTS: Steps Bar Chart */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/10 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Step Tracking</h3>
              <p className="text-xs text-slate-400 font-semibold">Daily step counts this week</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-100 font-bold rounded-lg text-slate-500 flex items-center gap-1">
            <Calendar size={12} /> 7 Days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 700 }}
            />
            <Bar dataKey="steps" fill="url(#stepsGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECHARTS: Calorie & Protein Line Chart */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/10 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Calorie Trend</h3>
              <p className="text-xs text-slate-400 font-semibold">Calories and protein over the week</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px", fontWeight: 700 }}
            />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} name="Calories" />
            <Line type="monotone" dataKey="protein" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: "#0d9488" }} name="Protein (g)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
