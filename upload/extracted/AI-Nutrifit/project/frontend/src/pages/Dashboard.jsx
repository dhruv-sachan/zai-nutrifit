import { useState } from "react";
import OverviewTab from "../components/dashboard/OverviewTab";
import AnalyticsTab from "../components/dashboard/AnalyticsTab";
import NutritionTab from "../components/dashboard/NutritionTab";
import TracksTab from "../components/dashboard/TracksTab";
import UserSettingsTab from "../components/dashboard/UserSettingsTab";
import FitnessTab from "../components/dashboard/FitnessTab";
import WellnessStoreTab from "../components/dashboard/WellnessStoreTab";
import AICopilotTab from "../components/dashboard/AICopilotTab";
import useAuthStore from "../store/useAuthStore";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      {/* ROW 1: Hero & User/Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white">
          <h1 className="text-3xl font-bold">Good Evening, Dhruv 👋</h1>
          <p className="text-slate-400 mt-2">
            Health Score: <span className="text-green-400 font-bold">87</span>
          </p>
          <p className="mt-4 text-lg">
            You're on track for your High Protein Fat Loss Goal.
          </p>
          <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full text-sm font-bold">
            Ask AI
          </button>
        </div>

        {/* User / Streak Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-500">Daniel Reeve</p>
            <p className="font-bold text-lg">Goal: Fat Loss</p>
          </div>
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold text-sm">12 Day Streak</p>
              <p className="text-xs opacity-80">
                Logged meals for 12 consecutive days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Contextual Metrics (Ring + Macros + Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring with Context */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <p className="text-sm font-bold text-slate-500">Today's Calories</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-black">0</span>
            <span className="text-slate-400">/ 2459 kcal</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: 2459 kcal</p>
        </div>

        {/* Macro Progress Bars */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <MacroBar
            label="Protein"
            value={184}
            total={200}
            percent={82}
            color="bg-blue-500"
          />
          <MacroBar
            label="Carbs"
            value={246}
            total={300}
            percent={65}
            color="bg-green-500"
          />
          <MacroBar
            label="Fat"
            value={82}
            total={100}
            percent={72}
            color="bg-yellow-500"
          />
        </div>

        {/* AI Insight Card */}
        <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-100">
          <h3 className="font-bold text-cyan-900">AI Insight</h3>
          <p className="text-sm text-cyan-800 mt-2">
            You are currently 42g below your protein target.
          </p>
          <p className="text-xs text-cyan-700 mt-4 font-bold">Suggested:</p>
          <ul className="text-xs text-cyan-700 mt-1 list-disc list-inside">
            <li>Greek Yogurt</li>
            <li>Eggs</li>
            <li>Chicken Breast</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper Component for the progress bars
function MacroBar({ label, value, percent, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-bold">{label}</span>
        <span className="font-bold">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
