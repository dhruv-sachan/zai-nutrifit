import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fluid Main Content */}
      <main className="flex-1 pl-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
