import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  addTask,
  deleteTask,
  getProfile,
  updateTask,
} from "../services/profileService";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Input from "../ui/Input";
import Select from "../ui/Select";


const categories = [
  "Assignment",
  "Project",
  "Study Topic",
  "Placement",
  "Internship",
  "Meeting",
  "Personal",
  "Reminder",
  "Other",
];


const today = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});


function Metric({ label, value, icon: Icon }) {
  return (
    <Card className="p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <Icon size={21} />
        </div>

      </div>

    </Card>
  );
}


function Dashboard() {

  const { user, logout } = useAuth();

  const location = useLocation();


  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);


  const [showPlannerHint, setShowPlannerHint] =
    useState(
      () =>
        location.state?.showPlannerHint ||
        sessionStorage.getItem(
          "tinypal_show_planner_hint"
        ) === "true"
    );


  const [form, setForm] = useState({
    title: "",
    category: "Assignment",
  });


  /*
   * Load profile
   */
  useEffect(() => {

    let active = true;

    getProfile()
      .then((value) => {

        if (active) {
          setProfile(value);
        }

      })
      .catch(() => {

        if (active) {
          setError(
            "We could not load your plan. Please refresh and try again."
          );
        }

      })
      .finally(() => {

        if (active) {
          setLoading(false);
        }

      });


    return () => {
      active = false;
    };

  }, []);


  /*
   * Persist planner hint after onboarding
   */
  useEffect(() => {

    if (location.state?.showPlannerHint) {

      sessionStorage.setItem(
        "tinypal_show_planner_hint",
        "true"
      );

      setShowPlannerHint(true);

    }

  }, [location.state]);


  /*
   * Close task modal
   */
  const close = () => {

    if (saving) return;

    setModal(false);

    setEditingId(null);

    setForm({
      title: "",
      category: "Assignment",
    });

  };


  /*
   * Open add/edit modal
   */
  const open = (task = null) => {

    setEditingId(task?.id || null);

    setForm(
      task
        ? {
            title: task.title,
            category: task.category,
          }
        : {
            title: "",
            category: "Assignment",
          }
    );

    setModal(true);

  };


  /*
   * Add / edit task
   */
  const submit = async (event) => {

    event.preventDefault();

    if (!form.title.trim()) return;

    setSaving(true);

    setError("");


    try {

      const payload = {
        ...form,
        title: form.title.trim(),
      };


      const result = editingId
        ? await updateTask(editingId, payload)
        : await addTask(payload);


      setProfile((current) => {

        if (!current) return current;


        if (editingId) {

          return {
            ...current,

            tasks: current.tasks.map((task) =>
              task.id === result.id
                ? result
                : task
            ),
          };

        }


        return {
          ...current,

          tasks: [
            ...current.tasks,
            result,
          ],
        };

      });


      close();

    } catch (requestError) {

      console.error(requestError);

      setError(
        `Task could not be ${
          editingId ? "updated" : "added"
        }. Please try again.`
      );

    } finally {

      setSaving(false);

    }

  };


  /*
   * Complete / uncomplete task
   */
  const toggle = async (task) => {

    try {

      const result = await updateTask(
        task.id,
        {
          completed: !task.completed,
        }
      );


      setProfile((current) => {

        if (!current) return current;

        return {
          ...current,

          tasks: current.tasks.map((item) =>
            item.id === result.id
              ? result
              : item
          ),
        };

      });

    } catch (requestError) {

      console.error(requestError);

      setError(
        "Task status could not be updated."
      );

    }

  };


  /*
   * Delete task
   */
  const remove = async (id) => {

    try {

      await deleteTask(id);


      setProfile((current) => {

        if (!current) return current;

        return {
          ...current,

          tasks: current.tasks.filter(
            (task) => task.id !== id
          ),
        };

      });

    } catch (requestError) {

      console.error(requestError);

      setError(
        "Task could not be deleted."
      );

    }

  };


  const tasks = profile?.tasks || [];

  const completed = tasks.filter(
    (task) => task.completed
  ).length;


  const preferredStudyTimes =
    profile?.preferred_study_times?.length
      ? profile.preferred_study_times
      : profile?.preferred_study_time
        ? [profile.preferred_study_time]
        : [];


  const displayName =
    user?.split("@")[0] || "there";


  /*
   * Loading state
   */
  if (loading) {

    return (
      <main className="tiny-page flex min-h-screen items-center justify-center px-6">

        <Card className="w-full max-w-md p-10 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Clock3
              size={22}
              className="animate-pulse"
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            Loading your workspace
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Getting everything ready for you.
          </p>

        </Card>

      </main>
    );

  }


  return (
    <main className="tiny-page min-h-screen">

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">


        {/* ================= HEADER ================= */}

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
              TinyPal Planner
            </p>

            <p className="mt-2 text-sm font-medium text-gray-400">
              {today.format(new Date()).toUpperCase()}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Welcome back, {displayName}.
            </h1>

            <p className="mt-2 max-w-xl text-gray-500">
              A calm view of everything that matters.
            </p>

          </div>


          <div className="flex flex-wrap items-center gap-3">

            <Button
              variant="secondary"
              onClick={() => open()}
            >
              <Plus size={17} />
              Add task
            </Button>


            <Button
              variant="secondary"
              onClick={logout}
            >
              <LogOut size={17} />
              Log out
            </Button>

          </div>

        </header>


        {/* ================= ERROR ================= */}

        {error && (

          <div
            role="alert"
            className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >

            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-red-400 hover:text-red-700"
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>

          </div>

        )}


        {/* ================= PLANNER PROMPT ================= */}

        {showPlannerHint && (

          <div className="mt-7 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/80 p-5 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={17}
                    className="text-violet-500"
                  />

                  <p className="font-semibold text-gray-900">
                    Your planner is ready
                  </p>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  TinyPal has created a schedule around
                  your tasks and preferred study windows.
                </p>

              </div>


              <div className="relative shrink-0">

                <span className="pointer-events-none absolute -inset-2 animate-pulse rounded-2xl border border-violet-300" />

                <span className="pointer-events-none absolute -right-3 -top-3 animate-pulse text-violet-500">
                  ✦
                </span>

                <span className="pointer-events-none absolute -bottom-3 -left-3 animate-pulse text-indigo-400">
                  ✧
                </span>


                <Link
                  to="/planner"
                  onClick={() => {

                    setShowPlannerHint(false);

                    sessionStorage.removeItem(
                      "tinypal_show_planner_hint"
                    );

                  }}
                >

                  <Button>
                    View my planner
                  </Button>

                </Link>

              </div>

            </div>

          </div>

        )}


        {/* ================= METRICS ================= */}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <Metric
            label="Daily study target"
            value={`${profile?.daily_study_target || 0}h`}
            icon={Clock3}
          />


          <Metric
            label="Tasks completed"
            value={`${completed} / ${tasks.length}`}
            icon={CheckCircle2}
          />


          <Metric
            label="Priorities"
            value={profile?.priorities?.length || 0}
            icon={Target}
          />

        </section>


        {/* ================= MAIN GRID ================= */}

        <section className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr]">


          {/* ================= TASKS ================= */}

          <Card className="p-5 sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={19}
                    className="text-indigo-500"
                  />

                  <h2 className="text-lg font-semibold text-gray-900">
                    Tasks
                  </h2>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Your saved work, ready when you are.
                </p>

              </div>


              <Badge>
                {tasks.length}{" "}
                {tasks.length === 1
                  ? "task"
                  : "tasks"}
              </Badge>

            </div>


            <div className="mt-6 space-y-2">

              {tasks.length ? (

                tasks.map((task) => (

                  <div
                    key={task.id}
                    className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
                      task.completed
                        ? "border-gray-100 bg-gray-50/70"
                        : "border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm"
                    }`}
                  >

                    {/* Completion */}
                    <button
                      type="button"
                      onClick={() => toggle(task)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        task.completed
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-indigo-200 hover:border-indigo-400"
                      }`}
                      aria-label={
                        task.completed
                          ? `Mark ${task.title} incomplete`
                          : `Mark ${task.title} complete`
                      }
                    >

                      {task.completed && (
                        <CheckCircle2 size={14} />
                      )}

                    </button>


                    {/* Task content */}
                    <button
                      type="button"
                      onClick={() => toggle(task)}
                      className="min-w-0 flex-1 text-left"
                    >

                      <p
                        className={`truncate text-sm font-medium ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="mt-1">
                        <Badge>
                          {task.category}
                        </Badge>
                      </div>

                    </button>


                    {/* Edit */}
                    <Button
                      variant="ghost"
                      onClick={() => open(task)}
                      className="min-h-9 px-2 opacity-70 transition group-hover:opacity-100"
                      aria-label={`Edit ${task.title}`}
                    >
                      <Pencil size={15} />
                    </Button>


                    {/* Delete */}
                    <Button
                      variant="danger"
                      onClick={() => remove(task.id)}
                      className="min-h-9 px-2"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 size={15} />
                    </Button>

                  </div>

                ))

              ) : (

                <div className="rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/30 p-8 text-center">

                  <p className="font-medium text-gray-700">
                    No tasks yet.
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Add your first task and TinyPal will
                    make space for it.
                  </p>

                  <Button
                    className="mt-5"
                    onClick={() => open()}
                  >
                    <Plus size={16} />
                    Add your first task
                  </Button>

                </div>

              )}

            </div>

          </Card>


          {/* ================= SIDE PANEL ================= */}

          <div className="space-y-6">


            {/* Priorities */}

            <Card className="p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <Target
                  size={19}
                  className="text-violet-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Priorities
                </h2>

              </div>


              {profile?.priorities?.length ? (

                <div className="mt-5 flex flex-wrap gap-2">

                  {profile.priorities.map(
                    (priority) => (

                      <Badge key={priority}>
                        {priority}
                      </Badge>

                    )
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-gray-400">
                  No priorities selected yet.
                </p>

              )}

            </Card>


            {/* Study rhythm */}

            <Card className="p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <Clock3
                  size={19}
                  className="text-indigo-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Your rhythm
                </h2>

              </div>


              <p className="mt-4 text-sm leading-6 text-gray-600">
                Preferred study windows:
              </p>


              <div className="mt-3 flex flex-wrap gap-2">

                {preferredStudyTimes.length ? (

                  preferredStudyTimes.map(
                    (item) => (

                      <Badge key={item}>

                        {item
                          .charAt(0)
                          .toUpperCase() +
                          item.slice(1)}

                      </Badge>

                    )
                  )

                ) : (

                  <span className="text-sm text-gray-400">
                    No study window selected.
                  </span>

                )}

              </div>


              <div className="mt-5 space-y-2 text-sm text-gray-500">

                <p>
                  Wake up:{" "}
                  <span className="font-medium text-gray-700">
                    {profile?.wake_up_time || "—"}
                  </span>
                </p>

                <p>
                  Sleep:{" "}
                  <span className="font-medium text-gray-700">
                    {profile?.sleep_time || "—"}
                  </span>
                </p>

                <p>
                  Daily target:{" "}
                  <span className="font-medium text-gray-700">
                    {profile?.daily_study_target || 0} hours
                  </span>
                </p>

                <p>
                  Breaks:{" "}
                  <span className="font-medium text-gray-700">
                    {profile?.break_duration || 0} minutes
                  </span>
                </p>

              </div>

            </Card>


            {/* Planner card */}

            <Card
              className={`relative overflow-hidden p-5 sm:p-6 ${
                showPlannerHint
                  ? "border-violet-200 shadow-[0_10px_40px_rgba(124,58,237,0.12)]"
                  : ""
              }`}
            >

              {showPlannerHint && (

                <>

                  <span className="pointer-events-none absolute -inset-[1px] animate-pulse rounded-2xl border border-violet-300" />

                  <Sparkles
                    size={18}
                    className="absolute right-4 top-4 animate-pulse text-violet-500"
                  />

                </>

              )}


              <CalendarDays
                size={20}
                className="text-indigo-500"
              />

              <h2 className="mt-4 font-semibold text-gray-900">
                Your planner
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                See today's focused schedule built around
                your tasks and commitments.
              </p>


              <Link
                to="/planner"
                className="mt-5 inline-block"
                onClick={() => {

                  setShowPlannerHint(false);

                  sessionStorage.removeItem(
                    "tinypal_show_planner_hint"
                  );

                }}
              >

                <Button variant="secondary">
                  View planner
                </Button>

              </Link>

            </Card>

          </div>

        </section>

      </div>


      {/* ================= TASK MODAL ================= */}

      {modal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/30 px-5 backdrop-blur-sm"
          onMouseDown={close}
        >

          <div
            className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-6 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  TinyPal
                </p>

                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {editingId
                    ? "Edit task"
                    : "Add a task"}
                </h2>

              </div>


              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>

            </div>


            <form
              onSubmit={submit}
              className="mt-6 space-y-5"
            >

              <Input
                autoFocus
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="e.g. Complete DBMS assignment"
              />


              <Select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </Select>


              <div className="flex justify-end gap-3">

                <Button
                  type="button"
                  variant="secondary"
                  onClick={close}
                  disabled={saving}
                >
                  Cancel
                </Button>


                <Button
                  type="submit"
                  disabled={
                    saving ||
                    !form.title.trim()
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Add task"}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}


export default Dashboard;  