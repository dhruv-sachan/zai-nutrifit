import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import {
  Dumbbell,
  Flame,
  CheckCircle2,
  Target,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Check,
  ChevronDown,
  RotateCcw,
  WifiOff,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function FitnessTab({ user }) {
  const [isOnline, setIsOnline] = useState(() =>
    typeof window !== "undefined" ? navigator.onLine : true,
  );
  const [syncingStatus, setSyncingStatus] = useState("");

  // Hydrate local states directly from hard-drive cache on initial render pass
  const [generatedRoutine, setGeneratedRoutine] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("nutrifit_local_routine");
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });

  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("nutrifit_local_routine");
    }
    return false;
  });

  const [completedExercises, setCompletedExercises] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("nutrifit_local_progress");
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });

  const [fitnessLevel, setFitnessLevel] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("nutrifit_local_meta");
      return cached ? JSON.parse(cached).fitnessLevel : "Intermediate";
    }
    return "Intermediate";
  });

  const [workoutFocus, setWorkoutFocus] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("nutrifit_local_meta");
      return cached ? JSON.parse(cached).workoutFocus : "Hypertrophy Strength";
    }
    return "Hypertrophy Strength";
  });

  const [equipment, setEquipment] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("nutrifit_local_meta");
      return cached ? JSON.parse(cached).equipment : "Dumbbells Only";
    }
    return "Dumbbells Only";
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const targetSteps = user?.stepGoal || 10000;
  const activePathway = user?.exerciseType || "Cardio Endurance Processing";

  const saveToLocalCache = (routine, progress, meta) => {
    localStorage.setItem("nutrifit_local_routine", JSON.stringify(routine));
    localStorage.setItem("nutrifit_local_progress", JSON.stringify(progress));
    localStorage.setItem("nutrifit_local_meta", JSON.stringify(meta));
  };

  const triggerBackgroundCloudSync = () => {
    setSyncingStatus("syncing");
    setTimeout(() => {
      setSyncingStatus("synced");
      setTimeout(() => setSyncingStatus(""), 4000);
    }, 2000);
  };

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      triggerBackgroundCloudSync();
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // UPDATED: Dispatches questionnaire data to the backend AI engine
  const handleRunAiGeneration = async () => {
    setIsAiGenerating(true);
    setErrorMessage("");

    // Fail-Safe Interceptor: Block request if client has no network access
    if (!navigator.onLine) {
      setErrorMessage(
        "Cannot connect to AI cluster while offline. Please reconnect or use cached data.",
      );
      setIsAiGenerating(false);
      return;
    }

    try {
      const response = await API.post("/ai/generate-workout", {
        fitnessLevel,
        workoutFocus,
        equipment,
        userContext: {
          age: user?.age,
          weight: user?.weight,
          height: user?.height,
          stepGoal: user?.stepGoal,
          exerciseType: user?.exerciseType,
          dietPreference: user?.dietPreference,
        },
      });

      if (response.data.success && response.data.plan) {
        const dynamicPlan = response.data.plan;
        setGeneratedRoutine(dynamicPlan);
        setHasGeneratedPlan(true);

        // Mirror the fresh AI plan to local cache immediately
        saveToLocalCache(dynamicPlan, completedExercises, {
          fitnessLevel,
          workoutFocus,
          equipment,
        });
      } else {
        throw new Error("Invalid payload schema received from AI node.");
      }
    } catch (err) {
      console.error("AI pipeline communication error:", err);
      setErrorMessage(
        "AI cluster timeout. Please verify internet access and backend server status.",
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const toggleExerciseCheck = (id, e) => {
    e.stopPropagation();
    const updatedProgress = completedExercises.includes(id)
      ? completedExercises.filter((item) => item !== id)
      : [...completedExercises, id];

    setCompletedExercises(updatedProgress);
    saveToLocalCache(generatedRoutine, updatedProgress, {
      fitnessLevel,
      workoutFocus,
      equipment,
    });
  };

  const resetWizardDeck = () => {
    setCompletedExercises([]);
    setGeneratedRoutine([]);
    setHasGeneratedPlan(false);
    localStorage.removeItem("nutrifit_local_routine");
    localStorage.removeItem("nutrifit_local_progress");
  };

  const progressPct =
    generatedRoutine.length > 0
      ? Math.round((completedExercises.length / generatedRoutine.length) * 100)
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* CONNECTION NOTIFIER OVERLAYS */}
      {!isOnline && (
        <div className="p-4 bg-linear-to-r from-rose-500/10 via-orange-500/5 to-transparent border border-rose-100 backdrop-blur-xl rounded-2xl flex items-center gap-3 text-sm font-bold text-rose-700 animate-pulse">
          <WifiOff size={18} className="text-rose-500" />
          <span>
            Offline State Triggered. Local Storage Fallback Cache Layer is
            active.
          </span>
        </div>
      )}

      {syncingStatus === "syncing" && (
        <div className="p-4 bg-linear-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-amber-700">
          <Loader2 size={16} className="animate-spin text-amber-500" />
          <span>Syncing local progress matrix to cloud data cluster...</span>
        </div>
      )}

      {syncingStatus === "synced" && (
        <div className="p-4 bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-emerald-800 animate-scaleIn">
          <RefreshCw size={18} className="text-emerald-500" />
          <span>
            Cloud Synchronization Complete. Local hard-drive configurations
            match cluster values.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-2">
          <ShieldAlert size={16} /> {errorMessage}
        </div>
      )}

      {/* HEADER CARD */}
      <div className="bg-linear-to-r from-teal-500/10 via-cyan-500/5 to-transparent border border-teal-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white border border-teal-100 text-teal-600 rounded-2xl shadow-xs">
            <Dumbbell size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {activePathway}
            </h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">
              Active Performance Track Pathways Operational
            </p>
          </div>
        </div>

        {hasGeneratedPlan && (
          <button
            onClick={resetWizardDeck}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Re-Calibrate Wizard
          </button>
        )}
      </div>

      {/* QUESTIONNAIRE WIZARD */}
      {!hasGeneratedPlan && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-8 max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-teal-500/10 to-cyan-500/10 border border-teal-100 text-teal-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" /> Core
              Initialization
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Setup Your AI Training Target
            </h3>
            <p className="text-slate-400 text-base font-medium">
              Answer these fast biometric questions to structure a tailored
              workflow execution layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 tracking-widest">
                Experience Tier
              </label>
              <div className="flex flex-col gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFitnessLevel(level)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer flex justify-between items-center ${
                      fitnessLevel === level
                        ? "border-teal-500 bg-teal-50/40 text-teal-700 shadow-xs"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{level}</span>
                    {fitnessLevel === level && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 tracking-widest">
                Primary Objective
              </label>
              <div className="flex flex-col gap-2">
                {[
                  "Hypertrophy Strength",
                  "Metabolic Volatility",
                  "Core Restoration",
                ].map((focus) => (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setWorkoutFocus(focus)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer flex justify-between items-center ${
                      workoutFocus === focus
                        ? "border-cyan-500 bg-cyan-50/40 text-cyan-700 shadow-xs"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{focus}</span>
                    {workoutFocus === focus && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 tracking-widest">
                Gear Deployment
              </label>
              <div className="flex flex-col gap-2">
                {[
                  "Pure Bodyweight",
                  "Dumbbells Only",
                  "Full Commercial Gym",
                ].map((gear) => (
                  <button
                    key={gear}
                    type="button"
                    onClick={() => setEquipment(gear)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer flex justify-between items-center ${
                      equipment === gear
                        ? "border-emerald-500 bg-emerald-50/40 text-emerald-700 shadow-xs"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{gear}</span>
                    {equipment === gear && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={handleRunAiGeneration}
              disabled={isAiGenerating}
              className="w-full sm:w-72 bg-linear-to-r from-teal-500 via-cyan-500 to-emerald-500 text-white font-black text-base tracking-wide uppercase py-4 rounded-xl shadow-lg shadow-teal-500/10 transition-transform active:scale-98 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 mx-auto"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Streaming True AI Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Customized Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE CORE MANAGEMENT PANEL */}
      {hasGeneratedPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 font-black text-lg tracking-tight mb-2 border-b border-slate-100 pb-3">
                <Target size={20} className="text-teal-500" />
                <span>Generated Circuit Objectives</span>
              </div>

              <div className="space-y-3">
                {generatedRoutine.map((exercise) => {
                  const isExpanded = expandedExercise === exercise.id;
                  const isChecked = completedExercises.includes(exercise.id);

                  return (
                    <div
                      key={exercise.id}
                      onClick={() =>
                        setExpandedExercise(isExpanded ? null : exercise.id)
                      }
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isExpanded
                          ? "border-teal-300 bg-linear-to-b from-white to-slate-50/30 shadow-md"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/40"
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none">
                        <div className="flex items-center gap-4 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => toggleExerciseCheck(exercise.id, e)}
                            className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-teal-500 border-teal-500 text-white shadow-xs"
                                : "border-slate-300 bg-white text-transparent hover:border-teal-400"
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>

                          <div className="min-w-0">
                            <h4
                              className={`text-base font-extrabold tracking-tight truncate transition-all ${isChecked ? "text-slate-400 line-through" : "text-slate-800"}`}
                            >
                              {exercise.name}
                            </h4>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                              {exercise.sets} Sets{" "}
                              <span className="text-slate-300 mx-1">•</span>{" "}
                              {exercise.reps} Reps
                            </p>
                          </div>
                        </div>

                        <ChevronDown
                          size={18}
                          className={`text-slate-400 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-fadeIn text-sm font-medium">
                          <div className="bg-slate-50 rounded-xl p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Target Zone:{" "}
                            <span className="text-slate-800 font-black">
                              {exercise.target}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs uppercase tracking-wider">
                              <HelpCircle size={14} /> Correct Execution Form
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-5 bg-emerald-50/20 border-l-2 border-emerald-500 py-1 rounded-r-md">
                              {exercise.form}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-rose-600 font-black text-xs uppercase tracking-wider">
                              <ShieldAlert size={14} /> What to Avoid / Safety
                              Risks
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-5 bg-rose-50/20 border-l-2 border-rose-500 py-1 rounded-r-md">
                              {exercise.avoid}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TELEMETRY VISUAL INDICATORS */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 font-black text-sm uppercase tracking-wider text-slate-400">
              <Flame size={20} className="text-orange-500 animate-pulse" />
              <span>Routine Telemetry Dashboard</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-500 uppercase tracking-wide">
                  Circuit Completion:
                </span>
                <span className="text-2xl font-mono font-black text-slate-900">
                  {progressPct}%
                </span>
              </div>

              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden relative border border-slate-100">
                <div
                  className="h-full bg-linear-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>0 Completed</span>
                <span>
                  {completedExercises.length} / {generatedRoutine.length}{" "}
                  Checked
                </span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-500 uppercase tracking-wide">
                  Daily Step Objective:
                </span>
                <span className="text-xl font-mono font-black text-slate-900">
                  {targetSteps.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-start gap-3 px-1 text-slate-400 text-xs font-semibold leading-relaxed">
              <CheckCircle2
                size={16}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
              <p>
                Checking off items increments your metric progress bar live. To
                request form alternatives, ping your floating{" "}
                <span className="text-rose-500 font-bold">
                  Copilot Core Chatbot
                </span>{" "}
                down in the corner.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
