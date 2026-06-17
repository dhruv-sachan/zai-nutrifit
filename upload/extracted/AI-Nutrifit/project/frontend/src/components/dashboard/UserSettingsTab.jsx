import { useState } from "react";
import API from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";
import {
  User,
  ShieldCheck,
  Weight,
  Ruler,
  Footprints,
  Flame,
  Loader2,
  Save,
} from "lucide-react";

export default function UserSettingsTab() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Populate local form states with live fallback user values
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [height, setHeight] = useState(user?.height || "");
  const [stepGoal, setStepGoal] = useState(user?.stepGoal || 10000);
  const [exerciseType, setExerciseType] = useState(
    user?.exerciseType || "Cardio",
  );

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    // FIXED: Removed the unused baseCalories variable to satisfy ESLint compiler checks
    const payload = {
      name,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      stepGoal: Number(stepGoal),
      exerciseType,
    };

    try {
      const response = await API.put("/user/profile", payload);

      // Update global store values across the whole application instantly
      setUser(response.data.user);
      setStatus("success");
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      console.error("Profile configuration adjustment error:", err);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/5 space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Account Configurations
        </h2>
        <p className="text-base text-slate-400 font-medium mt-1">
          Manage your active metabolic metrics, credentials, and tracking
          vectors.
        </p>
      </div>

      {status === "success" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-base font-bold flex items-center gap-2 animate-scaleIn">
          <ShieldCheck size={18} className="text-emerald-600" /> Account metrics
          reconfigured and synchronized to cluster.
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-base font-bold flex items-center gap-2">
          Configuration modification packet rejected. Check connection logs.
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Core Identity Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
              Full Operator Name
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-wider">
              Email Node (Immutable Token)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl font-medium cursor-not-allowed text-base"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">
            Biometric Calibration
          </h3>

          {/* Dynamic Metrics Data Input Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                Age (yrs)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                Weight (kg)
              </label>
              <div className="relative">
                <Weight
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                Height (cm)
              </label>
              <div className="relative">
                <Ruler
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                Step Target
              </label>
              <div className="relative">
                <Footprints
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="number"
                  value={stepGoal}
                  onChange={(e) => setStepGoal(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 text-base"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Routine Activity Threshold Select Box */}
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
            Primary Kinetic Pathway
          </label>
          <div className="relative">
            <Flame
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <select
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 appearance-none text-base cursor-pointer"
            >
              <option value="Cardio">Cardio Endurance Processing</option>
              <option value="Strength Training">
                Hypertrophy Strength Training
              </option>
              <option value="Yoga / Flexibility">Yoga Core Restoration</option>
              <option value="HIIT (High Intensity)">
                HIIT Metabolic Volatility Circuits
              </option>
            </select>
          </div>
        </div>

        {/* Form Submission Execution Engine */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-base tracking-wide uppercase py-4 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-75 mt-4"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Save size={18} /> Save Configurations
            </>
          )}
        </button>
      </form>
    </div>
  );
}
