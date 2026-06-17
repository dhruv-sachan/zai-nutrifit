import API from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";
import {
  Scale,
  Activity,
  Droplets,
  Brain,
  ShieldAlert,
  Heart,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function TracksTab() {
  // Pull the active user model and the sync state method out of our central Zustand deck
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Enhanced 2026 clinical track metadata mapping perfectly to your architectural criteria
  const clinicalTracks = [
    {
      id: "Standard Balanced",
      name: "Weight Management",
      desc: "Sustainable calorie configurations and lean metric enhancement routing.",
      icon: Scale,
      bg: "bg-orange-50 text-orange-500",
      accentColor: "border-orange-500",
      calorieMultiplier: 1.0,
      proteinRatio: 0.3,
    },
    {
      id: "PCOS Focus Optimization",
      name: "PCOS / PCOD Control",
      desc: "Hormone-optimized nutrient ratios and insulin-stabilization filters.",
      icon: Activity,
      bg: "bg-emerald-50 text-emerald-600",
      accentColor: "border-emerald-500",
      calorieMultiplier: 0.95,
      proteinRatio: 0.35,
    },
    {
      id: "Low-Glycemic Glucose Control",
      name: "Diabetes Management",
      desc: "Glycemic load stabilization profiles mapping blood sugar safety thresholds.",
      icon: ShieldAlert,
      bg: "bg-blue-50 text-blue-500",
      accentColor: "border-blue-500",
      calorieMultiplier: 0.9,
      proteinRatio: 0.3,
    },
    {
      id: "Low-FODMAP Gut Health",
      name: "Digestive Health",
      desc: "Gut-friendly recipes tailored to minimize bloating and metabolic friction.",
      icon: Droplets,
      bg: "bg-purple-50 text-purple-500",
      accentColor: "border-purple-500",
      calorieMultiplier: 1.0,
      proteinRatio: 0.25,
    },
    {
      id: "Mindfulness Stress Reduction",
      name: "Mental Resilience",
      desc: "Mindfulness nutritional tracking structures minimizing oxidative stressors.",
      icon: Brain,
      bg: "bg-pink-50 text-pink-500",
      accentColor: "border-pink-500",
      calorieMultiplier: 1.0,
      proteinRatio: 0.25,
    },
    {
      id: "Cardiovascular Sodium Regulation",
      name: "Heart Health Matrix",
      desc: "Sodium restrictions and clear lipid optimization parameters.",
      icon: Heart,
      bg: "bg-red-50 text-red-500",
      accentColor: "border-red-500",
      calorieMultiplier: 0.95,
      proteinRatio: 0.3,
    },
  ];

  // State mutator loop handling live database commits and macro recalculations
  const handleSelectTrack = async (track) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const baseCalories = 2200; // Baseline metabolic target metric anchor
    const adjustedCalories = Math.round(baseCalories * track.calorieMultiplier);

    // Re-calculate the macro split grams based on track target ratios
    const proteinGrams = Math.round(
      (adjustedCalories * track.proteinRatio) / 4,
    );
    const fatGrams = Math.round((adjustedCalories * 0.3) / 9);
    const carbGrams = Math.round(
      (adjustedCalories * (1 - track.proteinRatio - 0.3)) / 4,
    );

    const payload = {
      dietPreference: track.id,
      targetCalories: adjustedCalories,
      macros: {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams,
      },
    };

    try {
      // Commit the update directly to MongoDB Atlas so state persists across reloads
      const response = await API.put("/user/profile", payload);

      // Update global Zustand state immediately to refresh all visual UI meters instantly
      setUser(response.data.user);
    } catch (err) {
      console.error("Clinical track modification rejected by database:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeDietPreference = user?.dietPreference || "Standard Balanced";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
            Clinical Architecture
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Personalized Coaching Grid
          </h2>
          <p className="text-slate-500 text-base mt-2 max-w-2xl">
            Select an active track condition below. Your daily calorie bounds,
            macro rings, and active AI context will shift instantly.
          </p>
        </div>

        {isUpdating && (
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-4 py-2 rounded-xl h-fit shadow-xs animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span>Syncing Metrics...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinicalTracks.map((track) => {
          const Icon = track.icon;
          const isSelected = activeDietPreference === track.id;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`bg-white border p-8 rounded-3xl shadow-xs transition-all duration-300 group cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden ${
                isSelected
                  ? `border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg shadow-emerald-500/5 -translate-y-0.5`
                  : "border-slate-200/60 hover:border-slate-300/80 hover:shadow-md"
              }`}
            >
              {/* Selected Notification Accent Badge utilizing clean styling parameters */}
              {isSelected && (
                <div className="absolute top-4 right-4 text-emerald-600">
                  <CheckCircle2 size={22} fill="#ecfdf5" />
                </div>
              )}

              <div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105 ${track.bg}`}
                >
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {track.name}
                </h3>
                <p className="text-slate-400 text-sm font-semibold leading-relaxed mt-2.5 line-clamp-3">
                  {track.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
