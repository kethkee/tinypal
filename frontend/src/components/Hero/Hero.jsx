function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#FFF8F0]">

      <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-2 gap-12 items-center">

        <div>

          <h1 className="text-6xl font-black text-gray-800 leading-tight">
            Meet
            <span className="text-red-500"> TinyPal</span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 leading-8">
            Your AI-powered study companion that plans your day,
            keeps you motivated, predicts missed deadlines,
            and turns productivity into an adventure.
          </p>

          <div className="mt-10 flex gap-4">

            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
              Start Your Journey
            </button>

            <button className="border border-red-400 text-red-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-50 transition">
              Learn More
            </button>

          </div>

        </div>

        <div className="flex justify-center">

          <div className="w-80 h-80 rounded-3xl bg-red-100 flex items-center justify-center shadow-lg">

            <span className="text-8xl">
                🤖
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;