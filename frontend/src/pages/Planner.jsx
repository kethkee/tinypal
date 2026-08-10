import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Target,
} from "lucide-react";

import jsPDF from "jspdf";

import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getPlan,
} from "../services/profileService";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";


function Planner() {

  const [plan, setPlan] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    let active = true;


    getPlan()
      .then((value) => {

        if (active) {
          setPlan(value);
        }

      })
      .catch((requestError) => {

        console.error(
          requestError
        );

        if (active) {

          setError(
            requestError.response?.data?.detail ||
              "Today's planner could not be loaded."
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


  const downloadPlanner =
    () => {

      if (!plan) return;


      const pdf =
        new jsPDF();


      let y = 20;


      pdf.setFontSize(22);

      pdf.setTextColor(
        40,
        35,
        70
      );

      pdf.text(
        "TinyPal Planner",
        20,
        y
      );


      y += 10;


      pdf.setFontSize(11);

      pdf.setTextColor(
        100
      );

      pdf.text(
        plan.date ||
          "Today's plan",
        20,
        y
      );


      y += 18;


      pdf.setFontSize(15);

      pdf.setTextColor(
        40,
        35,
        70
      );

      pdf.text(
        "Today's focus blocks",
        20,
        y
      );


      y += 10;


      pdf.setFontSize(11);


      if (
        !plan.blocks?.length
      ) {

        pdf.text(
          "No focus blocks scheduled.",
          20,
          y
        );

        y += 10;

      } else {

        plan.blocks.forEach(
          (block) => {

            if (y > 275) {

              pdf.addPage();

              y = 20;

            }


            pdf.text(
              `${block.start} - ${block.end}`,
              20,
              y
            );

            pdf.text(
              block.title,
              65,
              y
            );

            y += 8;

          }
        );

      }


      y += 10;


      if (y > 260) {

        pdf.addPage();

        y = 20;

      }


      pdf.setFontSize(15);

      pdf.text(
        "Today's priorities",
        20,
        y
      );


      y += 10;

      pdf.setFontSize(11);


      if (
        !plan.priorities?.length
      ) {

        pdf.text(
          "No priorities selected.",
          20,
          y
        );

        y += 10;

      } else {

        plan.priorities.forEach(
          (priority) => {

            pdf.text(
              `• ${priority}`,
              20,
              y
            );

            y += 8;

          }
        );

      }


      y += 10;


      if (y > 260) {

        pdf.addPage();

        y = 20;

      }


      pdf.setFontSize(15);

      pdf.text(
        "Recurring commitments",
        20,
        y
      );


      y += 10;

      pdf.setFontSize(11);


      if (
        !plan.commitments?.length
      ) {

        pdf.text(
          "No recurring commitments.",
          20,
          y
        );

      } else {

        plan.commitments.forEach(
          (item) => {

            if (y > 275) {

              pdf.addPage();

              y = 20;

            }


            pdf.text(
              `${item.day} · ${item.start}-${item.end} · ${item.title}`,
              20,
              y
            );

            y += 8;

          }
        );

      }


      pdf.save(
        `TinyPal-Planner-${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

    };


  return (
    <main className="tiny-page min-h-screen">

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">


        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>


        <header className="mt-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">
            {plan?.date ||
              "TODAY'S PLAN"}
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                Today's planner
              </h1>

              <p className="mt-3 max-w-2xl text-gray-500">
                A focused schedule built around
                today's tasks, your routine, and
                recurring commitments.
              </p>

            </div>


            {plan && (

              <Button
                variant="secondary"
                onClick={
                  downloadPlanner
                }
              >
                <Download size={16} />
                Download planner
              </Button>

            )}

          </div>

        </header>


        {loading && (

          <Card className="mt-8 p-8 text-center">

            <Clock3
              size={22}
              className="mx-auto animate-pulse text-indigo-500"
            />

            <p className="mt-4 text-gray-500">
              Preparing today's schedule...
            </p>

          </Card>

        )}


        {!loading && error && (

          <Card className="mt-8 p-8 text-center">

            <p className="text-red-600">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="mt-5 inline-block"
            >
              <Button variant="secondary">
                Back to dashboard
              </Button>
            </Link>

          </Card>

        )}


        {!loading && plan && (

          <>


            {/* Summary */}

            <section className="mt-7 grid gap-4 sm:grid-cols-3">

              <Card className="p-5">

                <CheckCircle2
                  size={20}
                  className="text-indigo-500"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Today's tasks
                </p>

                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {plan.tasks?.length || 0}
                </p>

              </Card>


              <Card className="p-5">

                <Target
                  size={20}
                  className="text-violet-500"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Today's priorities
                </p>

                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {plan.priorities?.length || 0}
                </p>

              </Card>


              <Card className="p-5">

                <Clock3
                  size={20}
                  className="text-indigo-500"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Generated
                </p>

                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {plan.generated_at}
                </p>

              </Card>

            </section>


            {/* Focus blocks */}

            <Card className="mt-6 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <Clock3
                  size={19}
                  className="text-indigo-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Focus blocks
                </h2>

              </div>


              <div className="mt-5 space-y-3">

                {plan.blocks?.length ? (

                  plan.blocks.map(
                    (block) => (

                      <div
                        key={`${block.start}-${block.title}`}
                        className="flex items-center gap-4 rounded-2xl border border-indigo-100 p-4"
                      >

                        <p className="w-24 shrink-0 text-sm font-semibold text-indigo-600">
                          {block.start}–
                          {block.end}
                        </p>


                        <div>

                          <p className="font-medium text-gray-800">
                            {block.title}
                          </p>

                          <Badge className="mt-1">
                            {block.category}
                          </Badge>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <p className="py-5 text-sm text-gray-500">
                    No focus blocks are available yet.
                    Add today's tasks to generate your schedule.
                  </p>

                )}

              </div>

            </Card>


            {/* Priorities */}

            <Card className="mt-6 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <Target
                  size={19}
                  className="text-violet-500"
                />

                <h2 className="font-semibold text-gray-900">
                  Today's priorities
                </h2>

              </div>


              <div className="mt-4 flex flex-wrap gap-2">

                {plan.priorities?.length ? (

                  plan.priorities.map(
                    (priority) => (

                      <Badge
                        key={priority}
                      >
                        {priority}
                      </Badge>

                    )
                  )

                ) : (

                  <p className="text-sm text-gray-500">
                    No priorities selected.
                  </p>

                )}

              </div>

            </Card>


            {/* Commitments */}

            <Card className="mt-6 p-5 sm:p-6">

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={19}
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
                        key={`${item.title}-${index}`}
                        className="text-sm text-gray-600"
                      >
                        {item.day} ·{" "}
                        {item.start}–
                        {item.end} ·{" "}
                        {item.title}
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