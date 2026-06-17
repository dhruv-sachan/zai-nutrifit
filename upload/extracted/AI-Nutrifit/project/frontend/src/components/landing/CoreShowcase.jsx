import { useNavigate } from "react-router-dom";

const CoreShowcase = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      title: "Precision Macro Profiling",
      text: "No generic calorie counting. Our engine profiles your metabolic rate down to the gram based on active lifestyle changes.",
    },
    {
      title: "Real-Time Workout Readjustment",
      text: "Missed your daily steps or had an intense training session? Your training blocks shift dynamically to balance recovery.",
    },
    {
      title: "Zero-Frustration Automation",
      text: "Generate weeks of nutrition plans and grocery strategies in under three seconds with our zero-overhead backend processing.",
    },
  ];

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side: Text Content Layer */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="text-sm font-bold tracking-wider text-emerald-600 uppercase">
            Deep Intelligence Layer
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-gabriela text-slate-900 leading-tight">
            Designed for Precision. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600">
              Built for Longevity.
            </span>
          </h2>

          <p className="text-slate-600 font-gabriela text-base leading-relaxed">
            Legacy fitness apps force you to adapt to their static database
            templates. NutriFit AI flips the paradigm, constantly processing
            your active recovery, sleep patterns, and biometric variations to
            build a program around your life.
          </p>

          {/* Checklist Blocks */}
          <div className="space-y-6 pt-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-none mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold font-gabriela text-slate-900 group-hover:text-emerald-600 transition-colors duration-200">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-500 font-gabriela text-sm mt-1 leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
            >
              Explore the Algorithm
            </button>
          </div>
        </div>

        {/* Right Side: Visual Accent Frame */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          {/* Decorative geometric frames inspired by Nutras */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-linear-to-br from-cyan-400/20 to-emerald-400/20 rounded-full blur-3xl -z-10"></div>

          <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden group hover:shadow-2xl transition-all duration-300">
            {/* Miniature decorative canvas background shape */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative space-y-4">
              <div className="h-4 w-1/3 bg-emerald-200 rounded-full animate-pulse"></div>
              <div className="h-3 w-3/4 bg-slate-200 rounded-full"></div>
              <div className="h-3 w-5/6 bg-slate-200 rounded-full"></div>

              {/* Abstract telemetry wave representation */}
              <div className="pt-4 pb-2">
                <svg
                  viewBox="0 0 100 25"
                  className="w-full text-emerald-500 drop-shadow-md"
                >
                  <path
                    d="M0,10 Q15,0 30,15 T60,5 T90,20 L100,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="h-8 w-20 bg-slate-900 rounded-lg"></div>
                <div className="h-6 w-12 bg-cyan-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreShowcase;
