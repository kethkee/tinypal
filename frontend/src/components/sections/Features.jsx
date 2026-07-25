import FeatureCard from "../ui/FeatureCard";

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
            organized, and motivated.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-10">

          <FeatureCard
            icon="📅"
            title="Smart Planner"
            description="Automatically organize your study schedule based on deadlines and priorities."
          />

          <FeatureCard
            icon="🤖"
            title="AI Study Companion"
            description="Receive personalized study tips, reminders, and motivation every day."
          />

          <FeatureCard
            icon="📊"
            title="Progress Analytics"
            description="Track your streaks, productivity, and academic growth with beautiful insights."
          />

        </div>

      </div>

    </section>
  );
}

export default Features;