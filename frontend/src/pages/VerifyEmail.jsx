import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import api from "../services/api";

function VerifyEmail() {
  const { userId, token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await api.get(
          `auth/verify-email/${userId}/${token}/`
        );

        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or expired."
        );
      }
    };

    verify();
  }, [userId, token]);

  return (
    <main className="tiny-page flex min-h-screen items-center justify-center px-6">

      <div className="w-full max-w-md rounded-[32px] border border-violet-100 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(91,76,180,0.10)] backdrop-blur-xl">

        {status === "loading" && (
          <>
            <Loader2
              className="mx-auto animate-spin text-indigo-600"
              size={40}
            />

            <h1 className="mt-6 text-2xl font-semibold text-gray-950">
              Verifying your email
            </h1>

            <p className="mt-3 text-gray-500">
              Just a moment while we confirm your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              className="mx-auto text-green-500"
              size={48}
            />

            <h1 className="mt-6 text-2xl font-semibold text-gray-950">
              Email verified
            </h1>

            <p className="mt-3 text-gray-500">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Continue to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              className="mx-auto text-red-500"
              size={48}
            />

            <h1 className="mt-6 text-2xl font-semibold text-gray-950">
              Verification failed
            </h1>

            <p className="mt-3 text-gray-500">
              {message}
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Create another account
            </Link>
          </>
        )}

      </div>

    </main>
  );
}

export default VerifyEmail;