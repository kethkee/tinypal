import { motion } from "framer-motion";
import {
  CalendarDays,
  Brain,
  ChartNoAxesCombined,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Plan around your life",
    description:
      "Build schedules around your commitments, available time and preferred study rhythm.",
  },
  {
    icon: Brain,
    title: "Prioritize what matters",
    description:
      "Tell TinyPal what's important and let it protect time for the things that matter most.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "See your progress",
    description:
      "Understand your consistency and progress without overwhelming dashboards.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="bg-white px-6 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Built for real days
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Planning that adapts to you.
          </h2>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            TinyPal brings your tasks, priorities and routine together
            so planning feels simpler.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="group border-t border-gray-200 pt-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;