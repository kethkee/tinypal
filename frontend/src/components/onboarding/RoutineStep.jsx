import {
  BedDouble,
  Coffee,
  Moon,
  Sun,
  Clock3,
} from "lucide-react";

import { useState } from "react";

import Button from "../../ui/Button";
import Input from "../../ui/Input";

const periods = [
  {
    value: "morning",
    label: "Morning",
    description: "Quiet start",
    icon: Sun,
  },
  {
    value: "afternoon",
    label: "Afternoon",
    description: "Midday focus",
    icon: Coffee,
  },
  {
    value: "evening",
    label: "Evening",
    description: "After the day",
    icon: Moon,
  },
  {
    value: "night",
    label: "Night",
    description: "Late focus",
    icon: BedDouble,
  },
];

function RoutineStep({
  nextStep,
  prevStep,
  data,
  updateData,
}) {
  const [routine, setRoutine] = useState({
    wake_up_time: data.wake_up_time || "",
    sleep_time: data.sleep_time || "",
    preferred_study_times:
      data.preferred_study_times ||
      (data.preferred_study_time
        ? [data.preferred_study_time]
        : []),
    daily_study_target:
      data.daily_study_target || "",
    break_duration:
      data.break_duration || "25",
  });

  const update = (event) => {
    setRoutine((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const togglePeriod = (value) => {
    setRoutine((current) => {
      const selected =
        current.preferred_study_times.includes(value);

      return {
        ...current,
        preferred_study_times: selected
          ? current.preferred_study_times.filter(
              (item) => item !== value
            )
          : [
              ...current.preferred_study_times,
              value,
            ],
      };
    });
  };

  const positiveValues =
    Number(routine.daily_study_target) > 0 &&
    Number(routine.break_duration) > 0;

  const complete =
    routine.wake_up_time &&
    routine.sleep_time &&
    routine.preferred_study_times.length > 0 &&
    positiveValues;

  const handleContinue = () => {
    if (!complete) return;

    updateData({
      ...routine,

      // Keep the old backend-compatible field.
      preferred_study_time:
        routine.preferred_study_times[0],
    });

    nextStep();
  };

  return (
    <section>
      <header className="mb-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <Clock3 size={21} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          When do you like to focus?
        </h1>

        <p className="mt-2 max-w-xl text-gray-500">
          Choose every part of the day when you'd be
          comfortable studying. TinyPal will use these
          windows when shaping your planner.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {periods.map(
          ({
            value,
            label,
            description,
            icon: Icon,
          }) => {
            const selected =
              routine.preferred_study_times.includes(
                value
              );

            return (
              <button
                type="button"
                key={value}
                onClick={() => togglePeriod(value)}
                className={`group relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-center transition-all duration-300 ${
                  selected
                    ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm shadow-violet-100"
                    : "border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm"
                }`}
              >
                {selected && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-violet-500" />
                )}

                <Icon
                  size={20}
                  strokeWidth={1.8}
                />

                <span className="font-semibold">
                  {label}
                </span>

                <span className="text-xs text-gray-400">
                  {description}
                </span>
              </button>
            );
          }
        )}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {routine.preferred_study_times.length
          ? `${routine.preferred_study_times.length} study windows selected`
          : "Select at least one study window"}
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">
          Wake-up time

          <Input
            className="mt-2"
            type="time"
            name="wake_up_time"
            value={routine.wake_up_time}
            onChange={update}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Sleep time

          <Input
            className="mt-2"
            type="time"
            name="sleep_time"
            value={routine.sleep_time}
            onChange={update}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">
          Daily study target (hours)

          <Input
            className="mt-2"
            min="1"
            max="12"
            type="number"
            name="daily_study_target"
            value={routine.daily_study_target}
            onChange={update}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Break duration (minutes)

          <Input
            className="mt-2"
            min="1"
            max="120"
            type="number"
            name="break_duration"
            value={routine.break_duration}
            onChange={update}
          />
        </label>
      </div>

      <footer className="mt-9 flex justify-between">
        <Button
          variant="secondary"
          onClick={prevStep}
        >
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!complete}
        >
          Continue
        </Button>
      </footer>
    </section>
  );
}

export default RoutineStep;