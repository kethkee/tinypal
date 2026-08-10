from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from profiles.models import DailyPlan, Profile


PERIOD_STARTS = {
    "morning": "08:00",
    "afternoon": "13:00",
    "evening": "18:00",
    "night": "20:00",
}

BLOCK_DURATION = timedelta(
    minutes=60
)


class PlannerView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @staticmethod
    def at_time(day, value):

        return datetime.combine(
            day,
            datetime.strptime(
                value,
                "%H:%M",
            ).time(),
        )

    def get(self, request):

        try:

            profile = request.user.profile

        except Profile.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Complete your profile first."
                },
                status=404,
            )


        today = timezone.localdate()


        try:

            daily_plan = DailyPlan.objects.get(
                user=request.user,
                date=today,
            )

        except DailyPlan.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Create today's plan first."
                },
                status=404,
            )


        now = timezone.localtime(
            timezone.now()
        )


        wake = self.at_time(
            today,
            profile.wake_up_time.strftime(
                "%H:%M"
            ),
        )

        sleep = self.at_time(
            today,
            profile.sleep_time.strftime(
                "%H:%M"
            ),
        )


        if sleep <= wake:
            sleep += timedelta(days=1)


        preferred_periods = (
            profile.preferred_study_times
            or [
                profile.preferred_study_time
            ]
        )


        preferred_starts = [

            self.at_time(
                today,
                PERIOD_STARTS[period],
            )

            for period
            in preferred_periods

            if period in PERIOD_STARTS

        ]


        if preferred_starts:

            start = max(
                wake,
                min(preferred_starts),
            )

        else:

            start = wake


        break_length = timedelta(
            minutes=profile.break_duration
        )


        today_name = now.strftime(
            "%A"
        )


        commitments = []


        for item in profile.commitments:

            if (
                item["day"]
                != today_name
            ):
                continue


            commitment_start = (
                self.at_time(
                    today,
                    item["start"],
                )
            )

            commitment_end = (
                self.at_time(
                    today,
                    item["end"],
                )
            )


            if (
                commitment_end
                <= commitment_start
            ):

                commitment_end += (
                    timedelta(days=1)
                )


            commitments.append(
                (
                    commitment_start,
                    commitment_end,
                )
            )


        remaining_tasks = [
            task
            for task
            in daily_plan.tasks
            if not task.get("completed")
        ]


        blocks = []


        for task in remaining_tasks:

            if len(blocks) >= (
                profile.daily_study_target
            ):
                break


            moved = True


            while moved:

                moved = False

                end = (
                    start
                    + BLOCK_DURATION
                )


                for (
                    commitment_start,
                    commitment_end,
                ) in commitments:

                    if (
                        start
                        < commitment_end
                        and
                        end
                        > commitment_start
                    ):

                        start = (
                            commitment_end
                            + break_length
                        )

                        moved = True

                        break


            end = (
                start
                + BLOCK_DURATION
            )


            if end > sleep:
                break


            blocks.append(
                {
                    "title":
                        task["title"],

                    "category":
                        task["category"],

                    "start":
                        start.strftime(
                            "%H:%M"
                        ),

                    "end":
                        end.strftime(
                            "%H:%M"
                        ),
                }
            )


            start = (
                end
                + break_length
            )


        planned_count = len(
            blocks
        )


        return Response(
            {
                "method":
                    "Daily plan generated using "
                    "the user's permanent routine, "
                    "today's tasks, and recurring commitments.",

                "blocks":
                    blocks,

                "commitments":
                    profile.commitments,

                "priorities":
                    daily_plan.priorities,

                "tasks":
                    daily_plan.tasks,

                "date":
                    today.strftime(
                        "%A, %B %d"
                    ),

                "generated_at":
                    now.strftime(
                        "%H:%M"
                    ),

                "awake_window":
                    {
                        "start":
                            wake.strftime(
                                "%H:%M"
                            ),

                        "end":
                            sleep.strftime(
                                "%H:%M"
                            ),
                    },

                "preferred_study_times":
                    preferred_periods,

                "unscheduled_tasks":
                    max(
                        0,
                        len(
                            remaining_tasks
                        )
                        - planned_count,
                    ),
            }
        )