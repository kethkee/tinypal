import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Target,
  Sparkles,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProfile } from "../../services/profileService";

import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Badge from "../../ui/Badge";


function SummaryCard({ icon: Icon, title, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={18} />
        </div>

        <h2 className="font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-4 space-y-2">
        {children}
      </div>
    </Card>
  );
}


function ReviewStep({ prevStep, data }) {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");


  const handleFinish = async () => {
    setSaving(true);
    setError("");

    try {
      await createProfile(data);

      setSaving(false);
      setGenerating(true);

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
          state: {
            showPlannerHint: true,
          },
        });
      }, 2200);

    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.detail ||
          "We could not save your preferences. Please try again."
      );

      setSaving(false);
    }
  };


  /*
   * Planner generation screen
   */
  if (generating) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center text-center">

        <div className="relative">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
            <Sparkles size={30} />
          </div>

          <span className="absolute -right-3 -top-3 animate-pulse text-violet-400">
            ✦
          </span>

          <span className="absolute -bottom-2 -left-3 animate-pulse text-indigo-400">
            ✧
          </span>

        </div>


        <h1 className="mt-8 text-3xl font-semibold text-gray-950">
          Working on your planner
        </h1>


        <p className="mt-3 max-w-md text-gray-500">
          TinyPal is organizing your tasks, priorities,
          commitments, and study windows into a plan
          that fits your day.
        </p>


        <div className="mt-8 flex items-center gap-2">

          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />

        </div>

      </section>
    );
  }


  return (
    <section>

      <header className="mb-8">

        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <CheckCircle2 size={22} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Your plan is ready to create
        </h1>

        <p className="mt-2 text-gray-500">
          Review the information TinyPal will use to
          organize your schedule.
        </p>

      </header>


      <div className="grid gap-4 sm:grid-cols-2">

        {/* Tasks */}
        <SummaryCard
          icon={ListTodo}
          title={`${data.tasks?.length || 0} tasks`}
        >

          {data.tasks?.length ? (
            data.tasks.map((task, index) => (
              <div
                key={`${task.title}-${index}`}
                className="flex items-start justify-between gap-3"
              >
                <p className="text-sm text-gray-600">
                  {task.title}
                </p>

                <Badge>
                  {task.category}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No tasks added.
            </p>
          )}

        </SummaryCard>


        {/* Priorities */}
        <SummaryCard
          icon={Target}
          title={`${data.priorities?.length || 0} priorities`}
        >

          {data.priorities?.length ? (
            <div className="flex flex-wrap gap-2">
              {data.priorities.map((priority) => (
                <Badge key={priority}>
                  {priority}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No priorities selected.
            </p>
          )}

        </SummaryCard>


        {/* Commitments */}
        <SummaryCard
          icon={Clock3}
          title="Commitments"
        >

          {data.commitments?.length ? (
            data.commitments.map((item, index) => (
              <p
                className="text-sm text-gray-600"
                key={`${item.title}-${index}`}
              >
                {item.day} · {item.start}–{item.end} ·{" "}
                {item.title}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No recurring commitments added.
            </p>
          )}

        </SummaryCard>


        {/* Study preferences */}
        <SummaryCard
          icon={Clock3}
          title="Study preferences"
        >

          <p className="text-sm text-gray-600">
            Preferred study windows:
          </p>

          <div className="flex flex-wrap gap-2">
            {(
              data.preferred_study_times ||
              [data.preferred_study_time]
            )
              .filter(Boolean)
              .map((time) => (
                <Badge key={time}>
                  {time.charAt(0).toUpperCase() +
                    time.slice(1)}
                </Badge>
              ))}
          </div>

          <p className="text-sm text-gray-600">
            {data.daily_study_target} hours daily
          </p>

          <p className="text-sm text-gray-500">
            {data.wake_up_time} wake-up ·{" "}
            {data.sleep_time} sleep ·{" "}
            {data.break_duration} min breaks
          </p>

        </SummaryCard>

      </div>


      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}


      <div className="mt-9 flex justify-between">

        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={saving}
        >
          Back
        </Button>


        <Button
          onClick={handleFinish}
          disabled={saving}
        >
          {saving
            ? "Creating your plan..."
            : "Create my plan"}
        </Button>

      </div>

    </section>
  );
}


export default ReviewStep;