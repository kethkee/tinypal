import {
  Brain,
  CalendarClock,
  Trophy,
  Target,
} from "lucide-react";

const features = [
  {
    icon: <Brain size={36} />,
    title: "AI Powered",
    desc: "Smart recommendations to help you stay productive.",
  },
  {
    icon: <CalendarClock size={36} />,
    title: "Smart Scheduling",
    desc: "Automatically organize your study sessions.",
  },
  {
    icon: <Target size={36} />,
    title: "Goal Tracking",
    desc: "Stay focused with daily quests and progress tracking.",
  },
  {
    icon: <Trophy size={36} />,
    title: "Gamified Learning",
    desc: "Earn XP, maintain streaks and unlock achievements.",
  },
];

function WhyTinyPal() {
  return (
    <section className="bg-[#FAFAFC] py-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900">
            Why TinyPal?
          </h2>

          <p className="mt-5 text-xl text-gray-600">
            Built for students who want to study smarter, not harder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyTinyPal;
