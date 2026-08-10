import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPlan } from "../services/profileService";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";


function Planner() {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);


  useEffect(() => {
    let active = true;

    getPlan()
      .then((value) => {
        if (active) {
          setPlan(value);
        }
      })
      .catch((requestError) => {
        console.error(requestError);

        if (active) {
          setError(
            "Your schedule could not be generated. Complete onboarding and try again."
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);


  const downloadPlanner = () => {
    if (!plan) return;

    setDownloading(true);

    try {
      const pdf = new jsPDF();

      let y = 20;


      /*
       * Title
       */
      pdf.setFontSize(22);
      pdf.setTextColor(30, 25, 55);

      pdf.text(
        "TinyPal Planner",
        20,
        y
      );


      y += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(100);

      pdf.text(
        plan.date || "Today's plan",
        20,
        y
      );


      /*
       * Focus blocks
       */
      y += 18;

      pdf.setTextColor(30);
      pdf.setFontSize(15);

      pdf.text(
        "Focus blocks",
        20,
        y
      );


      y += 10;

      pdf.setFontSize(11);


      if (!plan.blocks?.length) {

        pdf.text(
          "No focus blocks scheduled.",
          20,
          y
        );

        y += 10;

      } else {

        plan.blocks.forEach((block) => {

          if (y > 275) {
            pdf.addPage();
            y = 20;
          }

          pdf.setTextColor(90);

          pdf.text(
            `${block.start} - ${block.end}`,
            20,
            y
          );

          pdf.setTextColor(30);

          pdf.text(
            block.title,
            65,
            y
          );

          y += 8;

        });
      }


      /*
       * Commitments
       */
      y += 10;

      if (y > 260) {
        pdf.addPage();
        y = 20;
      }

      pdf.setTextColor(30);
      pdf.setFontSize(15);

      pdf.text(
        "Recurring commitments",
        20,
        y
      );


      y += 10;

      pdf.setFontSize(11);


      if (!plan.commitments?.length) {

        pdf.text(
          "No recurring commitments.",
          20,
          y
        );

      } else {

        plan.commitments.forEach((item) => {

          if (y > 275) {
            pdf.addPage();
            y = 20;
          }

          pdf.setTextColor(60);

          pdf.text(
            `${item.day} · ${item.start}-${item.end} · ${item.title}`,
            20,
            y
          );

          y += 8;

        });

      }


      /*
       * Footer
       */
      y += 12;

      if (y > 275) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFontSize(9);
      pdf.setTextColor(130);

      pdf.text(
        "Created with TinyPal",
        20,
        y
      );


      pdf.save(
        `TinyPal-Planner-${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

    } finally {
      setDownloading(false);
    }
  };


  return (
    <main className="tiny-page min-h-screen">

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">

        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>


        {/* Header */}
        <header className="mt-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold text-indigo-600">
                {plan?.date?.toUpperCase() ||
                  "TODAY'S PLAN"}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                A focused schedule, built for today.
              </h1>

              <p className="mt-3 max-w-2xl text-gray-500">
                TinyPal has organized your tasks,
                priorities, commitments, and preferred
                study windows into a focused plan.
              </p>

            </div>


            {plan && (
              <Button
                variant="secondary"
                onClick={downloadPlanner}
                disabled={downloading}
              >
                <Download size={16} />

                {downloading
                  ? "Preparing..."
                  : "Download planner"}
              </Button>
            )}

          </div>

        </header>


        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}


        {/* Loading */}
        {!plan && !error && (
          <Card className="mt-8 p-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Clock3 size={22} />
            </div>

            <h2 className="mt-5 font-semibold text-gray-900">
              Preparing your schedule
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              TinyPal is finding space for the things
              that matter today.
            </p>

          </Card>
        )}


        {/* Generated planner */}
        {plan && (
          <>

            <p className="mt-5 text-sm text-gray-400">
              Generated at {plan.generated_at}
            </p>


            {/* Focus blocks */}
            <Card className="mt-5 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <Clock3
                  size={18}
                  className="text-indigo-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Focus blocks
                </h2>

              </div>


              <div className="mt-5 space-y-3">

                {plan.blocks?.length ? (

                  plan.blocks.map((block) => (

                    <div
                      key={`${block.start}-${block.title}`}
                      className="flex items-center gap-4 rounded-xl border border-indigo-100 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                    >

                      <p className="w-24 shrink-0 text-sm font-semibold text-indigo-600">
                        {block.start}–{block.end}
                      </p>


                      <div className="min-w-0">

                        <p className="font-medium text-gray-800">
                          {block.title}
                        </p>

                        <Badge className="mt-1">
                          {block.category}
                        </Badge>

                      </div>

                    </div>

                  ))

                ) : (

                  <p className="py-5 text-sm text-gray-500">
                    All caught up — add an incomplete task
                    to generate focus blocks.
                  </p>

                )}

              </div>

            </Card>


            {/* Commitments */}
            <Card className="mt-5 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={18}
                  className="text-indigo-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Recurring commitments
                </h2>

              </div>


              <div className="mt-4 space-y-2">

                {plan.commitments?.length ? (

                  plan.commitments.map(
                    (item, index) => (
                      <p
                        className="text-sm text-gray-600"
                        key={`${item.title}-${index}`}
                      >
                        {item.day} · {item.start}–
                        {item.end} · {item.title}
                      </p>
                    )
                  )

                ) : (

                  <p className="text-sm text-gray-500">
                    No recurring commitments saved.
                  </p>

                )}

              </div>

            </Card>

          </>
        )}

      </div>

    </main>
  );
}


export default Planner;