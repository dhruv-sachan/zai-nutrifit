import {
  LayoutDashboard,
  BarChart3,
  Apple,
  Dumbbell,
  ShoppingBag,
  LogOut,
  Activity,
  Bot,
  Settings,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuthStore();

  const menuItems = [
    {
      id: "overview",
      label: "Overview Metrics",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "analytics",
      label: "Kinetic Analytics",
      icon: <BarChart3 size={18} />,
    },
    { id: "nutrition", label: "AI Meal Analyzer", icon: <Apple size={18} /> },
    {
      id: "fitness",
      label: "Performance Pathways",
      icon: <Dumbbell size={18} />,
    },
    { id: "store", label: "Wellness Store", icon: <ShoppingBag size={18} /> },
    { id: "copilot", label: "AI Copilot", icon: <Bot size={18} /> },
  ];

  return (
    <aside className="fixed left-5 top-5 bottom-5 w-66 border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/20 flex flex-col justify-between p-6 z-40 overflow-hidden group">
      <style>{`
        @keyframes sidebarMeshShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-sidebar-bg {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(209,250,229,0.2) 50%, rgba(207,250,254,0.25) 100%);
          background-size: 200% 200%;
          animation: sidebarMeshShift 12s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 animate-sidebar-bg backdrop-blur-xl z-0 pointer-events-none"></div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-2.5 rounded-xl text-white shadow-md shadow-emerald-500/10">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            NutriFit AI
          </span>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 transform cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20 translate-x-1"
                    : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 hover:translate-x-1"
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`}>
                  {item.icon}
                </div>
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50/40 rounded-xl transition-all duration-300 cursor-pointer group relative z-10"
      >
        <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Terminate Session</span>
      </button>
    </aside>
  );
}
