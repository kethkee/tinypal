import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Sparkles,
  Target,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import jsPDF from "jspdf";

import { getPlan } from "../services/profileService";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";


function Planner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /*
   * Load today's generated planner.
   */
  useEffect(() => {
    let active = true;

    const loadPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getPlan();

        if (active) {
          setPlan(result);
        }

      } catch (requestError) {
        console.error(
          "Planner loading failed:",
          requestError.response?.data ||
            requestError
        );

        if (active) {
          setError(
            requestError.response?.data?.detail ||
              "Your schedule could not be generated. Complete onboarding and try again."
          );
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      active = false;
    };
  }, []);


  /*
   * Download the visible planner as PDF.
   */
  const downloadPlanner = () => {
    if (!plan) {
      return;
    }

    const pdf = new jsPDF();

    let y = 20;

    /*
     * Title
     */
    pdf.setFontSize(24);
    pdf.setTextColor(45, 35, 75);
    pdf.text(
      "TinyPal Planner",
      20,
      y
    );

    y += 9;

    /*
     * Date
     */
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 110);

    pdf.text(
      plan.date || "Today's plan",
      20,
      y
    );

    y += 16;

    /*
     * Focus blocks
     */
    pdf.setFontSize(16);
    pdf.setTextColor(45, 35, 75);

    pdf.text(
      "Today's focus blocks",
      20,
      y
    );

    y += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 70);

    if (!plan.blocks?.length) {

      pdf.text(
        "No focus blocks scheduled.",
        20,
        y
      );

      y += 10;

    } else {

      plan.blocks.forEach(
        (block) => {

          /*
           * Add a new page if necessary.
           */
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }

          pdf.setFontSize(11);
          pdf.setTextColor(
            70,
            70,
            80
          );

          pdf.text(
            `${block.start} - ${block.end}`,
            20,
            y
          );

          pdf.setFontSize(12);
          pdf.setTextColor(
            35,
            35,
            45
          );

          pdf.text(
            block.title,
            65,
            y
          );

          y += 7;

          if (block.category) {
            pdf.setFontSize(9);
            pdf.setTextColor(
              120,
              120,
              130
            );

            pdf.text(
              block.category,
              65,
              y
            );

            y += 9;
          }
        }
      );
    }


    /*
     * Commitments
     */
    y += 6;

    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(16);
    pdf.setTextColor(
      45,
      35,
      75
    );

    pdf.text(
      "Today's commitments",
      20,
      y
    );

    y += 10;

    pdf.setFontSize(11);

    if (!plan.commitments?.length) {

      pdf.setTextColor(
        90,
        90,
        100
      );

      pdf.text(
        "No recurring commitments.",
        20,
        y
      );

    } else {

      plan.commitments.forEach(
        (item) => {

          if (y > 270) {
            pdf.addPage();
            y = 20;
          }

          pdf.setTextColor(
            60,
            60,
            70
          );

          pdf.text(
            `${item.day} · ${item.start} - ${item.end} · ${item.title}`,
            20,
            y
          );

          y += 8;
        }
      );
    }


    /*
     * Footer
     */
    y += 15;

    if (y > 275) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(9);
    pdf.setTextColor(
      140,
      140,
      150
    );

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
  };


  /*
   * Loading screen
   */
  if (loading) {
    return (
      <main className="tiny-page flex min-h-screen items-center justify-center px-6">

        <Card className="w-full max-w-md p-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">

            <CalendarDays
              size={25}
              className="animate-pulse"
            />

          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-950">
            Preparing your planner
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            TinyPal is putting your tasks and
            commitments into a schedule.
          </p>

          <div className="mt-6 flex justify-center gap-2">

            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />

            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />

            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />

          </div>

        </Card>

      </main>
    );
  }


  /*
   * Error screen
   */
  if (error) {
    return (
      <main className="tiny-page min-h-screen px-5 py-8">

        <div className="mx-auto max-w-4xl">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>


          <Card className="mt-8 p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <CalendarDays size={24} />
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-950">
              Your planner isn't ready yet
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block"
            >
              <Button>
                Back to dashboard
              </Button>
            </Link>

          </Card>

        </div>

      </main>
    );
  }


  /*
   * No plan
   */
  if (!plan) {
    return (
      <main className="tiny-page min-h-screen px-5 py-8">

        <div className="mx-auto max-w-4xl">

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>


          <Card className="mt-8 p-10 text-center">

            <CalendarDays
              size={32}
              className="mx-auto text-violet-500"
            />

            <h1 className="mt-5 text-2xl font-semibold text-gray-950">
              No planner available
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Create today's plan from your dashboard first.
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block"
            >
              <Button>
                Create today's plan
              </Button>
            </Link>

          </Card>

        </div>

      </main>
    );
  }


  /*
   * Main planner page
   */
  return (
    <main className="tiny-page min-h-screen px-5 py-8 sm:px-8 lg:py-10">

      <div className="mx-auto max-w-5xl">


        {/* Top navigation */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/dashboard"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>


          <Button
            variant="secondary"
            onClick={downloadPlanner}
          >
            <Download size={16} />
            Download planner
          </Button>

        </div>


        {/* Planner heading */}

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-violet-100 bg-white p-7 shadow-sm sm:p-10">

          {/* Decorative sparkles */}

          <span className="pointer-events-none absolute right-8 top-7 animate-pulse text-xl text-violet-300">
            ✦
          </span>

          <span className="pointer-events-none absolute right-20 top-16 animate-pulse text-sm text-indigo-300">
            ✧
          </span>

          <span className="pointer-events-none absolute bottom-8 left-10 animate-pulse text-sm text-violet-300">
            ✦
          </span>


          <div className="relative">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Sparkles size={25} />
            </div>


            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              Your planner is ready
            </h1>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Here's how TinyPal has organized your day around
              your tasks, priorities, study windows and
              recurring commitments.
            </p>


            <div className="mt-6 flex flex-wrap items-center gap-3">

              <Badge>
                <CalendarDays
                  size={14}
                  className="mr-1 inline"
                />

                {plan.date}
              </Badge>


              {plan.generated_at && (
                <Badge>
                  Generated at {plan.generated_at}
                </Badge>
              )}

            </div>

          </div>

        </section>


        {/* Summary */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <Card className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clock3 size={18} />
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Focus blocks
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {plan.blocks?.length || 0}
                </p>

              </div>

            </div>

          </Card>


          <Card className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Target size={18} />
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Study target
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {plan.daily_study_target || 0}h
                </p>

              </div>

            </div>

          </Card>


          <Card className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays size={18} />
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Commitments
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {plan.commitments?.length || 0}
                </p>

              </div>

            </div>

          </Card>

        </section>


        {/* Main timetable */}

        <Card className="mt-6 overflow-hidden p-0">

          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Today's schedule
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your focus blocks for today.
            </p>

          </div>


          <div className="p-5 sm:p-8">

            {plan.blocks?.length ? (

              <div className="space-y-3">

                {plan.blocks.map(
                  (block, index) => (
                    <div
                      key={`${block.start}-${block.title}-${index}`}
                      className="group grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[120px_1fr]"
                    >

                      {/* Time */}

                      <div className="pt-4 text-right">

                        <p className="text-sm font-semibold text-violet-600">
                          {block.start}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {block.end}
                        </p>

                      </div>


                      {/* Timeline */}

                      <div className="relative">

                        {index <
                          plan.blocks.length -
                            1 && (
                          <span className="absolute left-[-11px] top-8 h-[calc(100%+12px)] w-px bg-violet-100" />
                        )}


                        <span className="absolute left-[-16px] top-5 h-2.5 w-2.5 rounded-full border-2 border-violet-400 bg-white" />


                        <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 transition duration-200 hover:border-violet-200 hover:bg-violet-50">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                              <p className="font-semibold text-gray-900">
                                {block.title}
                              </p>

                              {block.category && (
                                <Badge className="mt-2">
                                  {block.category}
                                </Badge>
                              )}

                            </div>


                            <div className="flex items-center gap-1.5 text-xs text-gray-400">

                              <Clock3 size={13} />

                              {block.start}
                              {" – "}
                              {block.end}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            ) : (

              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">

                <CheckCircle2
                  size={28}
                  className="mx-auto text-violet-500"
                />

                <p className="mt-4 font-medium text-gray-700">
                  Your focus list is clear.
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Add an incomplete task from the dashboard
                  to create a focus block.
                </p>

              </div>

            )}

          </div>

        </Card>


        {/* Commitments */}

        <Card className="mt-6 p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <CalendarDays size={18} />

            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Today's commitments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Things that are already fixed in your day.
              </p>

            </div>

          </div>


          {plan.commitments?.length ? (

            <div className="mt-5 space-y-3">

              {plan.commitments.map(
                (item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <p className="font-medium text-gray-800">
                        {item.title}
                      </p>

                      {item.category && (
                        <p className="mt-1 text-xs text-gray-400">
                          {item.category}
                        </p>
                      )}

                    </div>


                    <div className="flex items-center gap-2 text-sm text-indigo-600">

                      <Clock3 size={15} />

                      {item.start}
                      {" – "}
                      {item.end}

                    </div>

                  </div>
                )
              )}

            </div>

          ) : (

            <p className="mt-5 rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">
              No recurring commitments for today.
            </p>

          )}

        </Card>


        {/* Bottom download */}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-violet-100 bg-violet-50/50 p-6 sm:flex-row">

          <div>

            <p className="font-semibold text-gray-900">
              Want a copy for later?
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Download today's planner as a PDF.
            </p>

          </div>


          <Button
            variant="secondary"
            onClick={downloadPlanner}
          >
            <Download size={16} />
            Download planner
          </Button>

        </div>


        <div className="h-10" />

      </div>

    </main>
  );
}


export default Planner;