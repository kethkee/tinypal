import { useState } from "react";

const goals = [
  "Placements",
  "Semester Exams",
  "Learn New Skills",
  "GATE",
  "Higher Studies",
  "Other",
];

function GoalsStep({ nextStep, prevStep, data, updateData }) {

  const [selectedGoal, setSelectedGoal] = useState(data.goal || "");

  const handleNext = () => {

    if (!selectedGoal) {
      alert("Please select a goal.");
      return;
    }

    updateData({
      goal: selectedGoal,
    });

    nextStep();

  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        🎯 Your Goal
      </h1>

      <p className="text-gray-600 mb-8">
        What's your main focus right now?
      </p>

      <div className="grid grid-cols-2 gap-4 mb-10">

        {goals.map((goal) => (

          <button
            key={goal}
            onClick={() => setSelectedGoal(goal)}
            className={`border rounded-2xl p-5 transition text-left

            ${
              selectedGoal === goal
                ? "bg-red-500 text-white border-red-500"
                : "bg-white hover:bg-red-50"
            }`}
          >

            {goal}

          </button>

        ))}

      </div>

      <div className="flex justify-between">

        <button
          onClick={prevStep}
          className="bg-gray-300 px-6 py-3 rounded-xl"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default GoalsStep;