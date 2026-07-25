import StatsCard from "../ui/StatsCard";

function Stats() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black text-gray-900">
            TinyPal by the Numbers
          </h2>

          <p className="mt-5 text-xl text-gray-600">
            Helping students stay organized every day.
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-8">

          <StatsCard
            number="10K+"
            label="Students"
          />

          <StatsCard
            number="500K+"
            label="Quests Completed"
          />

          <StatsCard
            number="95%"
            label="Productivity Boost"
          />

          <StatsCard
            number="24/7"
            label="AI Companion"
          />

        </div>

      </div>

    </section>
  );
}

export default Stats;