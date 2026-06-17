import { useNavigate } from "react-router-dom";

const PlatformShowcase = () => {
  const navigate = useNavigate();

  // Full 7-Day Macro Optimization Blueprint
  const mealPlans = [
    {
      day: "Monday",
      calories: "1,840 kcal",
      protein: "165g",
      image: "/images/courses/courses-1.jpg",
      meals: [
        "Oat Bowl + Whey",
        "Grilled Chicken Wrap",
        "Salmon + Sweet Potato",
      ],
      badge: "High Protein",
    },
    {
      day: "Tuesday",
      calories: "1,920 kcal",
      protein: "172g",
      image: "/images/courses/courses-2.jpg",
      meals: ["Scrambled Eggs", "Quinoa Salad", "Lean Steak + Asparagus"],
      badge: "Balanced",
    },
    {
      day: "Wednesday",
      calories: "1,780 kcal",
      protein: "145g",
      image: "/images/courses/courses-3.jpg",
      meals: [
        "Protein Dosa + Sambar",
        "Paneer Tikka Wrap",
        "Microwave Potato Sandwich",
      ],
      badge: "Plant-Based Core",
    },
    {
      day: "Thursday",
      calories: "1,900 kcal",
      protein: "160g",
      image: "/images/courses/courses-4.jpg",
      meals: [
        "Chia Seed Pudding",
        "High-Protein Veg Thali",
        "Grilled Fish + Greens",
      ],
      badge: "Low Carb",
    },
    {
      day: "Friday",
      calories: "1,860 kcal",
      protein: "155g",
      image: "/images/courses/courses-5.jpg",
      meals: [
        "Convection-Baked Garlic Bread + Eggs",
        "Lentil Soup",
        "Shrimp Tacos",
      ],
      badge: "Refuel Focus",
    },
    {
      day: "Saturday",
      calories: "2,100 kcal",
      protein: "180g",
      image: "/images/courses/courses-6.jpg",
      meals: [
        "Smoothie Bowl",
        "Chicken Caesar Salad",
        "Lean Mutton Curry + Rice",
      ],
      badge: "Hypertrophy Surge",
    },
    {
      day: "Sunday",
      calories: "1,750 kcal",
      protein: "140g",
      image: "/images/courses/courses-1.jpg", // Reusing an asset for the 7th slot
      meals: ["Protein Pancakes", "Tuna Stuffed Pita", "Restoration Dinner"],
      badge: "Active Recovery",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title Node */}
        <div className="text-center mb-16 space-y-4">
          <h6 className="text-emerald-600 font-bold uppercase tracking-widest text-sm">
            Intelligent Optimization
          </h6>
          <h2 className="text-4xl lg:text-5xl font-bold font-gabriela text-slate-900">
            Automated Macro Targeting
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-gabriela text-lg leading-relaxed">
            Visualize your entire week. The AI calculates precise protein, carb,
            and fat targets based on your real-time recovery metrics and dietary
            preferences.
          </p>
        </div>

        {/* 7-Day Matrix Grid */}
        {/* Uses grid-cols-1 on mobile, 2 on tablets, and 3 on desktops. The 7th card will wrap to a new row naturally. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 drop-shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Image Container with Dynamic Hardware-Accelerated Scaling */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <img
                  src={plan.image}
                  alt={`${plan.day} Meals`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {/* Floating Metric Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-700 font-bold text-xs uppercase tracking-wide shadow-sm">
                  {plan.badge}
                </div>
              </div>

              {/* Data Telemetry Layer */}
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <h4 className="text-xl font-bold font-gabriela text-slate-900">
                    {plan.day}
                  </h4>
                  <div className="text-right">
                    <span className="block text-emerald-600 font-bold text-lg">
                      {plan.calories}
                    </span>
                    <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      {plan.protein} Protein
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 grow">
                  {plan.meals.map((meal, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 text-sm font-gabriela flex items-start gap-2.5"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="leading-tight">{meal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Master Call to Action */}
        <div className="mt-20 text-center relative z-10">
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Generate My Blueprint{" "}
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-md ml-2 uppercase tracking-wider border border-emerald-500/30">
              Free
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
