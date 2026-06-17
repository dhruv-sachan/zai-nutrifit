"use client";

import { LayoutDashboard, BarChart3, Apple, Dumbbell, ShoppingBag, Bot, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "./Sidebar";

const navItems = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "nutrition", name: "Nutrition", icon: Apple },
  { id: "fitness", name: "Fitness", icon: Dumbbell },
  { id: "store", name: "Store", icon: ShoppingBag },
  { id: "copilot", name: "Copilot", icon: Bot },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  children,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Sidebar (desktop only) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile Top Bar with horizontal scrolling tabs */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-base font-black text-slate-900 tracking-tighter">
            NutriFit<span className="text-cyan-500">.</span>
          </h1>
          <button
            onClick={() => void logout()}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut size={16} /> Exit
          </button>
        </div>
        <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto nf-scroll">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "text-cyan-600 bg-cyan-50/60 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} /> {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fluid Main Content */}
      <main className="lg:pl-72 p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1">{children}</div>
        <footer className="mt-auto pt-8 pb-2 text-center text-xs text-slate-400 font-semibold">
          <div className="max-w-7xl mx-auto px-2">
            NutriFit — Your AI health companion. Targets are estimates; consult a
            professional for medical advice.
          </div>
        </footer>
      </main>
    </div>
  );
}
