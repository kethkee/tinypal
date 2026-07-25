import FeatureCard from "../ui/FeatureCard";
import {
  CalendarDays,
  Bot,
  ChartColumn,
} from "lucide-react";

function Features() {
  return (
    <section className="bg-[#FFF8F0] py-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black text-gray-900">
            Why Students Love TinyPal
          </h2>

          <p className="mt-6 text-xl text-gray-600">
            Everything you need to stay productive,
            organized and stress free.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-10">

          <FeatureCard
            icon={<CalendarDays size={36} />}
            title="Smart Planner"
            description="Automatically creates your study plan based on deadlines and priorities."
          />

          <FeatureCard
            icon={<Bot size={36} />}
            title="AI Study Companion"
            description="TinyPal motivates you, reminds you and keeps you focused every day."
          />

          <FeatureCard
            icon={<ChartColumn size={36} />}
            title="Progress Analytics"
            description="Visualize your growth with streaks, productivity insights and achievements."
          />

        </div>

      </div>
    </section>
  );
}

export default Features;