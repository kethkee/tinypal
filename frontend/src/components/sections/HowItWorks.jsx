import StepCard from "../ui/StepCard";

import {
  UserPlus,
  BookOpen,
  Sparkles,
} from "lucide-react";

function HowItWorks() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <h2 className="text-5xl font-black text-gray-900">

            How TinyPal Works

          </h2>

          <p className="mt-6 text-xl text-gray-600">

            Getting started takes less than a minute.

          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-20 mt-20">

          <StepCard

            number="1"

            icon={<UserPlus size={36} />}

            title="Create Account"

            description="Sign up and create your own TinyPal workspace."

            showArrow

          />

          <StepCard

            number="2"

            icon={<BookOpen size={36} />}

            title="Add Subjects"

            description="Enter your courses, assignments and study goals."

            showArrow

          />

          <StepCard

            number="3"

            icon={<Sparkles size={36} />}

            title="Study Smarter"

            description="TinyPal automatically creates your perfect study schedule."

          />

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;