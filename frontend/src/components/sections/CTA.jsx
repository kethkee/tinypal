import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-[#FAFAFC] px-6 py-24 sm:px-8"
    >
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[32px] border border-indigo-100 bg-white px-6 py-16 text-center shadow-[0_24px_80px_rgba(79,70,229,0.10)] sm:px-12">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles size={22} />
          </div>

          <h2 className="mt-7 text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Ready to make your days easier?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Bring your tasks, priorities and routine together
            and let TinyPal help you make space for what matters.
          </p>

          <div className="mt-9 flex justify-center">
            <Link to="/signup">
              <Button className="flex items-center gap-2">
                Get started free
                <ArrowRight size={17} />
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;