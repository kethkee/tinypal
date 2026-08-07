import { useState } from "react";

function RoutineStep({ nextStep, prevStep, data, updateData }) {

  const [routine, setRoutine] = useState({
    wake_up_time: data.wake_up_time || "",
    sleep_time: data.sleep_time || "",
    preferred_study_time: data.preferred_study_time || "",
    daily_study_target: data.daily_study_target || "",
  });

  const handleChange = (e) => {
    setRoutine({
      ...routine,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {

    if (
      !routine.wake_up_time ||
      !routine.sleep_time ||
      !routine.preferred_study_time ||
      !routine.daily_study_target
    ) {
      alert("Please complete all the fields.");
      return;
    }

    updateData(routine);

    nextStep();

  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-red-500 mb-3">
        🌙 Daily Routine
      </h1>

      <p className="text-gray-600 mb-8">
        Tell Tiny when you're usually most productive.
      </p>

      <div className="space-y-5">

        <div>

          <label className="block mb-2 font-medium">
            Wake-up Time
          </label>

          <input
            type="time"
            name="wake_up_time"
            value={routine.wake_up_time}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Sleep Time
          </label>

          <input
            type="time"
            name="sleep_time"
            value={routine.sleep_time}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Preferred Study Time
          </label>

          <select
            name="preferred_study_time"
            value={routine.preferred_study_time}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          >
            <option value="">Select</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Daily Study Target (Hours)
          </label>

          <input
            type="number"
            min="1"
            max="12"
            name="daily_study_target"
            value={routine.daily_study_target}
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

        </div>

      </div>

      <div className="flex justify-between mt-10">

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

export default RoutineStep;