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
    icon: Sun,
  },
  {
    value: "afternoon",
    label: "Afternoon",
    icon: Coffee,
  },
  {
    value: "evening",
    label: "Evening",
    icon: Moon,
  },
  {
    value: "night",
    label: "Night",
    icon: BedDouble,
  },
];


function RoutineStep({
  nextStep,
  prevStep,
  data,
  updateData,
}) {

  const [routine, setRoutine] =
    useState({

      wake_up_time:
        data.wake_up_time || "",

      sleep_time:
        data.sleep_time || "",

      preferred_study_times:
        data.preferred_study_times ||
        (
          data.preferred_study_time
            ? [
                data.preferred_study_time,
              ]
            : []
        ),

      daily_study_target:
        data.daily_study_target || "",

      break_duration:
        data.break_duration || "25",

    });


  const update = (
    event
  ) => {

    setRoutine(
      (current) => ({
        ...current,

        [event.target.name]:
          event.target.value,
      })
    );

  };


  const togglePeriod =
    (value) => {

      setRoutine(
        (current) => {

          const exists =
            current
              .preferred_study_times
              .includes(value);


          return {
            ...current,

            preferred_study_times:
              exists

                ? current.preferred_study_times
                    .filter(
                      (item) =>
                        item !== value
                    )

                : [
                    ...current.preferred_study_times,
                    value,
                  ],
          };

        }
      );

    };


  const positiveValues =
    Number(
      routine.daily_study_target
    ) > 0 &&
    Number(
      routine.break_duration
    ) > 0;


  const complete =
    routine.wake_up_time &&
    routine.sleep_time &&
    routine.preferred_study_times.length >
      0 &&
    positiveValues;


  const handleContinue =
    () => {

      if (!complete) {
        return;
      }


      updateData({

        ...routine,

        preferred_study_time:
          routine
            .preferred_study_times[0],

      });


      nextStep();

    };


  return (
    <section>

      <header className="mb-7">

        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Clock3 size={20} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Set your study rhythm
        </h1>

        <p className="mt-2 text-gray-500">
          Choose every part of the day when you
          would be comfortable studying.
        </p>

      </header>


      <div className="grid gap-5 sm:grid-cols-2">

        <label className="text-sm font-medium text-gray-700">

          Wake-up time

          <Input
            className="mt-2"
            type="time"
            name="wake_up_time"
            value={
              routine.wake_up_time
            }
            onChange={update}
          />

        </label>


        <label className="text-sm font-medium text-gray-700">

          Sleep time

          <Input
            className="mt-2"
            type="time"
            name="sleep_time"
            value={
              routine.sleep_time
            }
            onChange={update}
          />

        </label>

      </div>


      <p className="mt-6 text-sm font-medium text-gray-700">
        Preferred study windows
      </p>


      <p className="mt-1 text-sm text-gray-400">
        Select all that work for you.
      </p>


      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {periods.map(
          ({
            value,
            label,
            icon: Icon,
          }) => {

            const selected =
              routine
                .preferred_study_times
                .includes(value);


            return (
              <button
                type="button"
                key={value}
                onClick={() =>
                  togglePeriod(value)
                }
                className={`relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition ${
                  selected
                    ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-violet-200"
                }`}
              >

                {selected && (
                  <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-violet-500" />
                )}

                <Icon size={19} />

                {label}

              </button>
            );

          }
        )}

      </div>


      <p className="mt-3 text-sm text-gray-400">

        {routine
          .preferred_study_times
          .length
          ? `${routine.preferred_study_times.length} study windows selected`
          : "Select at least one study window."}

      </p>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        <label className="text-sm font-medium text-gray-700">

          Daily study target (hours)

          <Input
            className="mt-2"
            min="1"
            max="12"
            type="number"
            name="daily_study_target"
            value={
              routine.daily_study_target
            }
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
            value={
              routine.break_duration
            }
            onChange={update}
          />

        </label>

      </div>


      {!positiveValues &&
        (
          routine.daily_study_target ||
          routine.break_duration
        ) && (

          <p
            role="alert"
            className="mt-3 text-sm text-red-600"
          >
            Daily target and break duration
            must be positive.
          </p>

        )}


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