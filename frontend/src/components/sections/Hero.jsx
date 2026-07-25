import Button from "../ui/Button";

function Hero() {
  return (
    <section className="bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto min-h-[85vh] px-8 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}

        <div>

          <p className="text-[#FF5A5F] font-semibold text-lg mb-4">
            🌸 Meet TinyPal
          </p>

          <h1 className="text-6xl font-black text-gray-900 leading-tight">

            Organize Less.

            <br />

            Learn More.

          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-9 max-w-xl">

            TinyPal is your AI-powered study companion that helps you
            organize your day, build better habits, stay motivated,
            and achieve your academic goals effortlessly.

          </p>

          <div className="flex gap-5 mt-10">

            <Button>
              Start Journey
            </Button>

            <Button variant="secondary">
              Learn More
            </Button>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <div className="w-[420px] h-[420px] rounded-[40px] bg-gradient-to-br from-pink-100 to-red-100 shadow-2xl flex items-center justify-center">

            <span className="text-[170px]">
              🤖
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;