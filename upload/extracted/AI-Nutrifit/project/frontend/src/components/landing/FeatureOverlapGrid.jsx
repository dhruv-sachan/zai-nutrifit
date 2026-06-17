const FeatureOverlapGrid = () => {
  const pillars = [
    {
      title: "AI Nutrition Engine",
      description:
        "Dynamically computes precise macronutrient allocations and splits daily targets into structured meal windows.",
      gradient: "from-emerald-500 to-teal-500",
      iconPath: (
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      ),
    },
    {
      title: "Adaptive Fitness Architect",
      description:
        "Generates algorithmic workout pathways that adapt based on recovery telemetry and targeted muscle milestones.",
      gradient: "from-teal-500 to-cyan-500",
      iconPath: (
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
      ),
    },
    {
      title: "Biometric Telemetry Core",
      description:
        "Continuous processing of step density, fat thresholds, and metabolic rates to realign active training targets.",
      gradient: "from-cyan-500 to-emerald-500",
      iconPath: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-8 z-30 py-24 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 border border-slate-100 drop-shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:drop-shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-300 ease-in-out"
          >
            {/* Minimalist Floating Vector Icon Container */}
            <div
              className={`w-14 h-14 rounded-xl bg-linear-to-r ${pillar.gradient} flex items-center justify-center text-white mb-6 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                {pillar.iconPath}
              </svg>
            </div>

            {/* Typography Nodes */}
            <h3 className="text-xl font-bold font-gabriela text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200">
              {pillar.title}
            </h3>

            <p className="text-slate-600 font-gabriela text-sm leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureOverlapGrid;
