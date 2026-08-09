import { Mail, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function CheckEmail() {
  const location = useLocation();

  const email = location.state?.email || "your email address";

  return (
    <main className="tiny-page flex min-h-screen items-center justify-center px-6">

      <div className="w-full max-w-md rounded-[32px] border border-violet-100 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(91,76,180,0.10)] backdrop-blur-xl">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
          <Mail size={28} />
        </div>

        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-gray-950">
          Check your email
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          We've sent a verification link to
        </p>

        <p className="mt-2 font-semibold text-indigo-600">
          {email}
        </p>

        <p className="mt-5 text-sm leading-6 text-gray-400">
          Open the email and click the verification link
          to activate your TinyPal account.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

      </div>

    </main>
  );
}

export default CheckEmail;