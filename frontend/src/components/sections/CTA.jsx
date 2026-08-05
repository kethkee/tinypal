import Button from "../ui/Button";

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#FF5A5F] to-[#FF7A7F]">
      <div className="max-w-5xl mx-auto px-8 text-center">

        <h2 className="text-5xl font-black text-white">
          Ready to Start Your Journey?
        </h2>

        <p className="mt-6 text-xl text-white/90 leading-8">
          Join TinyPal today and let AI organize your studies,
          motivate you, and help you achieve your goals.
        </p>

        <div className="mt-10">
          <Button>Get Started Free</Button>
        </div>

      </div>
    </section>
  );
}

export default CTA;