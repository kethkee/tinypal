function WelcomeStep({ nextStep }) {
  return (
    <div className="text-center">

      <div className="text-7xl mb-6">
        🌸
      </div>

      <h1 className="text-4xl font-bold text-red-500 mb-5">
        Welcome to TinyPal!
      </h1>

      <p className="text-gray-600 text-lg leading-8 mb-10">
        Hi! I'm <span className="font-semibold">Tiny</span>, your AI study
        companion.
        <br />
        I'll ask you a few quick questions to understand your routine
        and create a personalized study plan.
      </p>

      <button
        onClick={nextStep}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
      >
        Let's Begin →
      </button>

    </div>
  );
}

export default WelcomeStep;