import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function FloatingCard({
  icon: Icon,
  title,
  position,
  delay = 0,
}) {
  return (
    <div
      className={`absolute ${position} flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md`}
      style={{
        animation: `float 5s ease-in-out ${delay}s infinite`,
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>

      <span className="whitespace-nowrap text-sm font-medium text-gray-700">
        {title}
      </span>
    </div>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await login({
        ...form,
        email: form.email.trim(),
      });

      navigate(
        response.profile?.onboarding_completed
          ? "/dashboard"
          : "/onboarding",
        { replace: true }
      );
    } catch (error) {
      setMessage(
        !error.response
          ? "Cannot reach TinyPal. Make sure the Django server is running."
          : error.response.status === 401
          ? "That email and password do not match an active account."
          : error.response.data?.detail ||
            "Login could not be completed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] px-5 py-6 sm:py-10">

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">

        {/* Login form */}
        <section className="flex items-center justify-center px-7 py-10 sm:px-12 lg:px-16">

          <form
            onSubmit={submit}
            className="w-full max-w-sm"
          >
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-gray-900"
            >
              TinyPal
            </Link>

            <div className="mt-12">

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Welcome back
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-950">
                Continue where you left off.
              </h1>

              <p className="mt-3 leading-7 text-gray-500">
                Sign in to access your tasks, priorities and study plan.
              </p>

            </div>

            <label className="mt-9 block text-sm font-medium text-gray-700">
              Email

              <input
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                required
              />
            </label>

            <label className="mt-5 block text-sm font-medium text-gray-700">
              Password

              <input
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value,
                  })
                }
                required
              />
            </label>

            {message && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log in
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <p className="mt-7 text-center text-sm text-gray-500">
              New here?{" "}
              <Link
                className="font-semibold text-indigo-600 hover:text-indigo-700"
                to="/signup"
              >
                Create an account
              </Link>
            </p>
          </form>

        </section>

        {/* Visual panel */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 lg:block">

          {/* Ambient circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />

          {/* Center content */}
          <div className="relative flex h-full min-h-[650px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                <Sparkles size={28} />
              </div>

              <h2 className="mt-7 text-3xl font-semibold tracking-tight text-gray-950">
                Your day,
                <br />
                thoughtfully planned.
              </h2>

              <p className="mx-auto mt-4 max-w-sm leading-7 text-gray-500">
                TinyPal brings your tasks and priorities together
                so you can focus on what matters next.
              </p>

            </div>

            <FloatingCard
              icon={CheckCircle2}
              title="Task completed"
              position="left-[8%] top-[20%]"
              delay={0}
            />

            <FloatingCard
              icon={CalendarDays}
              title="Weekly plan"
              position="right-[7%] top-[25%]"
              delay={0.7}
            />

            <FloatingCard
              icon={Clock3}
              title="Focus session"
              position="left-[12%] bottom-[23%]"
              delay={1.2}
            />

            <FloatingCard
              icon={Target}
              title="Priority focus"
              position="right-[8%] bottom-[19%]"
              delay={1.8}
            />

            <FloatingCard
              icon={ListTodo}
              title="Tasks organized"
              position="right-[27%] top-[9%]"
              delay={2.3}
            />

          </div>

          <style>{`
            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}</style>

        </aside>

      </div>
    </main>
  );
}

export default Login;