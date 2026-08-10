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

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  addTask,
  createTodayPlan,
  deleteTask,
  getProfile,
  getTodayPlan,
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

const todayFormatter = new Intl.DateTimeFormat(
  undefined,
  {
    weekday: "long",
    month: "long",
    day: "numeric",
  }
);


function Metric({ label, value, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}


function ConfettiCelebration() {
  const pieces = Array.from(
    { length: 36 },
    (_, index) => index
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <span
          key={piece}
          className="absolute top-[-20px] h-3 w-2 animate-[tinypal-confetti_2.8s_ease-out_forwards] rounded-sm"
          style={{
            left: `${(piece * 37) % 100}%`,
            animationDelay: `${(piece % 9) * 70}ms`,
            transform: `rotate(${piece * 31}deg)`,
          }}
        />
      ))}
    </div>
  );
}


function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creatingPlan, setCreatingPlan] = useState(false);

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

  const [showCelebration, setShowCelebration] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Assignment",
  });


  /* --------------------------------
     LOAD PROFILE + TODAY'S PLAN
  -------------------------------- */

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const savedProfile = await getProfile();

        if (!active) {
          return;
        }

        setProfile(savedProfile);

        try {
          const plan = await getTodayPlan();

          if (active) {
            setTodayPlan(plan);
          }

        } catch (planError) {
          console.error(
            "Today's plan could not be loaded:",
            planError.response?.data || planError
          );

          if (
            planError.response?.status === 404
          ) {
            if (active) {
              setTodayPlan(null);
            }
          } else {
            throw planError;
          }
        }

      } catch (requestError) {
        console.error(
          "Dashboard loading failed:",
          requestError.response?.data ||
            requestError
        );

        if (active) {
          setError(
            requestError.response?.data?.detail ||
              "We could not load your workspace. Please refresh and try again."
          );
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);


  /* --------------------------------
     PLANNER HINT
  -------------------------------- */

  useEffect(() => {
    if (location.state?.showPlannerHint) {
      sessionStorage.setItem(
        "tinypal_show_planner_hint",
        "true"
      );

      setShowPlannerHint(true);
    }
  }, [location.state]);


  /* --------------------------------
     TODAY'S DATA
  -------------------------------- */

  const tasks = todayPlan?.tasks || [];

  const priorities =
    todayPlan?.priorities || [];

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const allTasksCompleted =
    tasks.length > 0 &&
    completed === tasks.length;


  /* --------------------------------
     CONFETTI
  -------------------------------- */

  useEffect(() => {
    if (!allTasksCompleted) {
      return;
    }

    setShowCelebration(true);

    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 4200);

    return () => clearTimeout(timer);
  }, [allTasksCompleted]);


  /* --------------------------------
     STUDY WINDOWS
  -------------------------------- */

  const preferredStudyTimes =
    profile?.preferred_study_times?.length
      ? profile.preferred_study_times
      : profile?.preferred_study_time
        ? [profile.preferred_study_time]
        : [];


  const displayName =
    user?.split("@")[0] || "there";


  /* --------------------------------
     LOGOUT
  -------------------------------- */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (logoutError) {
      console.error(
        "Logout failed:",
        logoutError
      );
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user_email");

      sessionStorage.removeItem(
        "tinypal_show_planner_hint"
      );

      navigate("/", {
        replace: true,
      });
    }
  };


  /* --------------------------------
     CREATE TODAY'S PLAN
  -------------------------------- */

  const handleCreateToday = async () => {
    setCreatingPlan(true);
    setError("");

    const accessToken =
      localStorage.getItem("access");

    if (!accessToken) {
      setError(
        "Your login session has expired. Please log in again."
      );

      setCreatingPlan(false);

      navigate("/", {
        replace: true,
      });

      return;
    }

    try {
      const plan =
        await createTodayPlan({
          tasks: [],
          priorities: [],
        });

      setTodayPlan(plan);

      /*
       * Keep the loading screen visible
       * long enough for the user to understand
       * that TinyPal is creating their planner.
       */
      setTimeout(() => {
        sessionStorage.setItem(
          "tinypal_show_planner_hint",
          "true"
        );

        setCreatingPlan(false);
        setShowPlannerHint(true);
      }, 2200);

    } catch (requestError) {
      console.error(
        "Create today's plan failed:",
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data?.detail ||
          requestError.response?.data?.message ||
          "Today's plan could not be created. Please try again."
      );

      setCreatingPlan(false);
    }
  };


  /* --------------------------------
     TASK MODAL
  -------------------------------- */

  const close = () => {
    if (saving) {
      return;
    }

    setModal(false);
    setEditingId(null);

    setForm({
      title: "",
      category: "Assignment",
    });
  };


  const open = (task = null) => {
    setEditingId(
      task?.id || null
    );

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


  /* --------------------------------
     ADD / EDIT TASK
  -------------------------------- */

  const submit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
      };

      let result;

      if (editingId) {
        result = await updateTask(
          editingId,
          payload
        );
      } else {
        result = await addTask(payload);
      }

      setTodayPlan((current) => {
        if (!current) {
          return current;
        }

        if (editingId) {
          return {
            ...current,
            tasks: current.tasks.map(
              (task) =>
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
      console.error(
        "Task operation failed:",
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data?.detail ||
          `Task could not be ${
            editingId
              ? "updated"
              : "added"
          }. Please try again.`
      );

    } finally {
      setSaving(false);
    }
  };


  /* --------------------------------
     COMPLETE TASK
  -------------------------------- */

  const toggle = async (task) => {
    try {
      const result =
        await updateTask(
          task.id,
          {
            completed:
              !task.completed,
          }
        );

      setTodayPlan((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          tasks:
            current.tasks.map(
              (item) =>
                item.id === result.id
                  ? result
                  : item
            ),
        };
      });

    } catch (requestError) {
      console.error(
        "Task status update failed:",
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data?.detail ||
          "Task status could not be updated."
      );
    }
  };


  /* --------------------------------
     DELETE TASK
  -------------------------------- */

  const remove = async (id) => {
    try {
      await deleteTask(id);

      setTodayPlan((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          tasks:
            current.tasks.filter(
              (task) =>
                task.id !== id
            ),
        };
      });

    } catch (requestError) {
      console.error(
        "Task deletion failed:",
        requestError.response?.data ||
          requestError
      );

      setError(
        requestError.response?.data?.detail ||
          "Task could not be deleted."
      );
    }
  };


  /* --------------------------------
     LOADING
  -------------------------------- */

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


  /* --------------------------------
     PLANNER GENERATION SCREEN
  -------------------------------- */

  if (creatingPlan) {
    return (
      <main className="tiny-page flex min-h-screen items-center justify-center px-6">

        <section className="relative w-full max-w-xl text-center">

          <span className="absolute left-[18%] top-4 animate-pulse text-2xl text-violet-400">
            ✦
          </span>

          <span className="absolute right-[18%] top-10 animate-pulse text-xl text-indigo-400">
            ✧
          </span>

          <span className="absolute left-[28%] top-32 animate-pulse text-sm text-violet-300">
            ✦
          </span>

          <span className="absolute right-[27%] top-36 animate-pulse text-sm text-indigo-300">
            ✧
          </span>


          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">

            <div className="absolute inset-0 animate-ping rounded-[2rem] bg-violet-200/40" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-violet-200 bg-white text-violet-600 shadow-xl shadow-violet-100">

              <CalendarDays size={32} />

            </div>

          </div>


          <h1 className="mt-10 text-3xl font-semibold tracking-tight text-gray-950">
            Working on your planner
          </h1>


          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
            TinyPal is organizing your tasks,
            priorities, commitments, and study
            windows into a plan that fits your day.
          </p>


          <div className="mt-8 flex justify-center gap-2">

            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400" />

            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />

            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />

          </div>


          <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
            Creating today's plan
          </p>

        </section>

      </main>
    );
  }


  /* --------------------------------
     MAIN DASHBOARD
  -------------------------------- */

  return (
    <main className="tiny-page min-h-screen">

      {showCelebration && (
        <ConfettiCelebration />
      )}


      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">

        {/* HEADER */}

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
              TinyPal Planner
            </p>

            <p className="mt-2 text-sm font-medium text-gray-400">
              {todayFormatter
                .format(new Date())
                .toUpperCase()}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Welcome back, {displayName}.
            </h1>

            <p className="mt-2 text-gray-500">
              A calm view of what matters today.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            {todayPlan && (
              <Button
                onClick={() => open()}
              >
                <Plus size={17} />
                Add task
              </Button>
            )}


            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Log out
            </Button>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}


        {/* NO PLAN */}

        {!todayPlan && (
          <Card className="mt-8 overflow-hidden p-8 sm:p-12">

            <div className="mx-auto max-w-xl text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">

                <CalendarDays size={28} />

              </div>


              <h2 className="mt-7 text-2xl font-semibold text-gray-950">
                What would you like to make time for today?
              </h2>


              <p className="mt-3 text-gray-500">
                Your daily plan is fresh each day.
                Your routine and recurring commitments
                stay saved, while today's tasks and
                priorities start from a clean slate.
              </p>


              <Button
                className="mt-7"
                onClick={handleCreateToday}
                disabled={creatingPlan}
              >
                <Sparkles size={17} />

                Create today's plan
              </Button>

            </div>

          </Card>
        )}


        {/* TODAY'S PLAN */}

        {todayPlan && (
          <>

            <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Metric
                label="Daily study target"
                value={`${profile?.daily_study_target || 0}h`}
                icon={Clock3}
              />

              <Metric
                label="Today's tasks"
                value={`${completed} / ${tasks.length}`}
                icon={CheckCircle2}
              />

              <Metric
                label="Today's priorities"
                value={priorities.length}
                icon={Target}
              />

              <Metric
                label="Commitments"
                value={
                  profile?.commitments?.length ||
                  0
                }
                icon={CalendarDays}
              />

            </section>


            {allTasksCompleted && (
              <Card className="mt-6 border-violet-200 bg-violet-50/70 p-5">

                <div className="flex items-center gap-3">

                  <Sparkles
                    size={21}
                    className="text-violet-600"
                  />

                  <div>

                    <p className="font-semibold text-violet-950">
                      Everything on today's list is done.
                    </p>

                    <p className="mt-1 text-sm text-violet-700">
                      Nice work. You made space for what mattered today.
                    </p>

                  </div>

                </div>

              </Card>
            )}


            <section className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

              {/* TASKS */}

              <Card className="p-5 sm:p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="font-semibold text-gray-900">
                      Today's tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Only today's work appears here.
                    </p>

                  </div>

                  <Badge>
                    {tasks.length}{" "}
                    {tasks.length === 1
                      ? "task"
                      : "tasks"}
                  </Badge>

                </div>


                <div className="mt-5 space-y-2">

                  {tasks.length ? (

                    tasks.map((task) => (

                      <div
                        key={task.id}
                        className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
                          task.completed
                            ? "border-gray-100 bg-gray-50"
                            : "border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm"
                        }`}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            toggle(task)
                          }
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                            task.completed
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-indigo-200"
                          }`}
                        >

                          {task.completed && (
                            <CheckCircle2 size={13} />
                          )}

                        </button>


                        <div className="min-w-0 flex-1">

                          <p
                            className={`text-sm font-medium ${
                              task.completed
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {task.title}
                          </p>

                          <Badge className="mt-1.5">
                            {task.category}
                          </Badge>

                        </div>


                        <Button
                          variant="ghost"
                          onClick={() =>
                            open(task)
                          }
                          className="min-h-9 px-2"
                        >
                          <Pencil size={15} />
                        </Button>


                        <Button
                          variant="danger"
                          onClick={() =>
                            remove(task.id)
                          }
                          className="min-h-9 px-2"
                        >
                          <Trash2 size={15} />
                        </Button>

                      </div>

                    ))

                  ) : (

                    <div className="rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/30 p-8 text-center">

                      <p className="font-medium text-gray-700">
                        Your list is empty.
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Add the things you want to make time for today.
                      </p>

                      <Button
                        className="mt-5"
                        onClick={() =>
                          open()
                        }
                      >
                        <Plus size={16} />
                        Add today's first task
                      </Button>

                    </div>

                  )}

                </div>

              </Card>


              {/* RIGHT SIDE */}

              <div className="space-y-6">

                {/* PRIORITIES */}

                <Card className="p-5 sm:p-6">

                  <div className="flex items-center gap-2">

                    <Target
                      size={19}
                      className="text-violet-500"
                    />

                    <h2 className="font-semibold text-gray-900">
                      Today's priorities
                    </h2>

                  </div>


                  {priorities.length ? (

                    <div className="mt-4 flex flex-wrap gap-2">

                      {priorities.map(
                        (priority) => (
                          <Badge key={priority}>
                            {priority}
                          </Badge>
                        )
                      )}

                    </div>

                  ) : (

                    <p className="mt-4 text-sm text-gray-400">
                      No priorities selected for today.
                    </p>

                  )}

                </Card>


                {/* RHYTHM */}

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


                  <p className="mt-4 text-sm text-gray-500">
                    Preferred study windows
                  </p>


                  <div className="mt-3 flex flex-wrap gap-2">

                    {preferredStudyTimes.map(
                      (item) => (
                        <Badge key={item}>
                          {item
                            .charAt(0)
                            .toUpperCase() +
                            item.slice(1)}
                        </Badge>
                      )
                    )}

                  </div>


                  <div className="mt-5 space-y-2 text-sm text-gray-500">

                    <p>
                      Wake-up:{" "}
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


                  <Link
                    to="/onboarding?edit=true"
                    className="mt-5 inline-flex text-sm font-semibold text-indigo-600"
                  >
                    Adjust routine
                  </Link>

                </Card>


                {/* PLANNER CARD */}

                <Card
                  className={`relative overflow-hidden p-5 sm:p-6 transition-all duration-500 ${
                    showPlannerHint
                      ? "border-violet-300 shadow-[0_12px_45px_rgba(124,58,237,0.18)]"
                      : ""
                  }`}
                >

                  {showPlannerHint && (
                    <>
                      {/* Animated ring */}

                      <span className="pointer-events-none absolute -inset-2 animate-pulse rounded-2xl border-2 border-violet-300" />


                      {/* Outer glow */}

                      <span className="pointer-events-none absolute -inset-4 animate-pulse rounded-3xl bg-violet-400/5" />


                      {/* Sparkles */}

                      <span className="pointer-events-none absolute -right-4 -top-4 animate-pulse text-lg text-violet-500">
                        ✦
                      </span>

                      <span className="pointer-events-none absolute -bottom-3 -left-3 animate-pulse text-sm text-indigo-400">
                        ✧
                      </span>

                      <span className="pointer-events-none absolute -right-3 bottom-0 animate-pulse text-xs text-violet-300">
                        ✦
                      </span>
                    </>
                  )}


                  <CalendarDays
                    size={20}
                    className="text-indigo-500"
                  />


                  <h2 className="mt-4 font-semibold text-gray-900">
                    Today's planner
                  </h2>


                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    See how TinyPal has arranged today's
                    tasks around your routine and commitments.
                  </p>


                  {/* VIEW PLANNER BUTTON */}

                  <div className="relative mt-5 inline-block">

                    {showPlannerHint && (
                      <>
                        <span className="pointer-events-none absolute -inset-2 animate-pulse rounded-2xl border-2 border-violet-300" />

                        <span className="pointer-events-none absolute -inset-4 animate-pulse rounded-3xl bg-violet-400/5" />

                        <span className="pointer-events-none absolute -right-4 -top-4 animate-pulse text-lg text-violet-500">
                          ✦
                        </span>

                        <span className="pointer-events-none absolute -bottom-3 -left-3 animate-pulse text-sm text-indigo-400">
                          ✧
                        </span>
                      </>
                    )}


                    <Link
                      to="/planner"
                      onClick={() => {
                        setShowPlannerHint(false);

                        sessionStorage.removeItem(
                          "tinypal_show_planner_hint"
                        );
                      }}
                    >
                      <Button variant="secondary">

                        <CalendarDays size={16} />

                        View planner

                      </Button>
                    </Link>

                  </div>

                </Card>

              </div>

            </section>

          </>
        )}

      </div>


      {/* TASK MODAL */}

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
                  Today's plan
                </p>

                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {editingId
                    ? "Edit task"
                    : "Add task"}
                </h2>

              </div>


              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100"
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
                  setForm({
                    ...form,
                    title:
                      event.target.value,
                  })
                }
                placeholder="What needs to get done today?"
              />


              <Select
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category:
                      event.target.value,
                  })
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


              <div className="flex justify-end gap-2">

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


      <style>{`
        @keyframes tinypal-confetti {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }

          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

    </main>
  );
}


export default Dashboard;