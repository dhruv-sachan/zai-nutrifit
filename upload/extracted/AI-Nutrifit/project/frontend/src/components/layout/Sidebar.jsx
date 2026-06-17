import {
  LayoutDashboard,
  BarChart3,
  Apple,
  Dumbbell,
  ShoppingBag,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuthStore();

  // Mapping your tabs to icons
  const navItems = [
    { id: "overview", name: "Overview Metrics", icon: LayoutDashboard },
    { id: "analytics", name: "Kinetic Analytics", icon: BarChart3 },
    { id: "nutrition", name: "AI Meal Analyzer", icon: Apple },
    { id: "fitness", name: "Performance Pathways", icon: Dumbbell },
    { id: "store", name: "Wellness Store", icon: ShoppingBag },
    { id: "copilot", name: "AI Copilot", icon: Bot },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white/60 backdrop-blur-2xl border-r border-slate-200/60 p-6 flex flex-col z-50">
      {/* Brand */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">
          NutriFit<span className="text-cyan-500">.</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "text-cyan-600 bg-cyan-50/50 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {/* Linear-style border indicator */}
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full" />
              )}

              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors"
      >
        <LogOut size={20} />
        Terminate Session
      </button>
    </aside>
  );
}
