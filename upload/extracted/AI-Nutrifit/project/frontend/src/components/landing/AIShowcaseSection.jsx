import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2 } from "lucide-react";

import aiMealImg from "../../assets/sections/nutrition-side.jpg";

const AIShowcaseSection = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <BrainCircuit className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">
                Neural Generation
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-slate-900">
              Stop guessing. Let AI build your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                Perfect Routine.
              </span>
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              Traditional fitness apps give you static templates. NutriFit uses
              a deeply integrated Gemini model to analyze your exact macros,
              daily fatigue, and biometric goals to generate hyper-personalized
              workouts and meal plans in real-time.
            </p>

            <div className="space-y-4">
              {[
                "Dynamic Meal Macro Adjustments",
                "Equipment-Aware Workout Generation",
                "Daily Recovery Protocol Scaling",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE: Visual/Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* UPDATE: Removed the decorative blur div entirely for a cleaner look */}

            <img
              src={aiMealImg}
              alt="AI Meal Generation Interface"
              className="relative rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-200/80 object-cover w-full h-auto transform hover:scale-[1.02] transition-transform duration-500"
            />

            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold">100%</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Macro Goal Hit
                </p>
                <p className="text-xs text-slate-500">Generated 2 mins ago</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;
