from datetime import datetime, timedelta

from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from profiles.models import Profile


PERIOD_STARTS = {
    "morning": "08:00",
    "afternoon": "13:00",
    "evening": "18:00",
    "night": "20:00",
}

BLOCK_DURATION = timedelta(minutes=60)


class PlannerView(APIView):

    permission_classes = [IsAuthenticated]


    @staticmethod
    def at_time(day, value):
        """
        Convert a date + HH:MM string into a datetime.
        """

        return datetime.combine(
            day,
            datetime.strptime(
                value,
                "%H:%M"
            ).time()
        )


    def get(self, request):

        # -----------------------------------
        # Get user's profile
        # -----------------------------------

        try:

            profile = request.user.profile

        except Profile.DoesNotExist:

            return Response(
                {
                    "detail": "Complete onboarding to generate a plan."
                },
                status=404,
            )


        # -----------------------------------
        # Current local date/time
        # -----------------------------------

        now = timezone.localtime(
            timezone.now()
        )

        today = now.date()


        # -----------------------------------
        # Wake and sleep times
        # -----------------------------------

        wake = self.at_time(
            today,
            profile.wake_up_time.strftime(
                "%H:%M"
            )
        )

        sleep = self.at_time(
            today,
            profile.sleep_time.strftime(
                "%H:%M"
            )
        )


        # If sleep time is earlier than
        # wake time, sleep belongs to
        # the following day.

        if sleep <= wake:

            sleep += timedelta(days=1)


        # -----------------------------------
        # Preferred study periods
        # -----------------------------------

        preferred_periods = getattr(
            profile,
            "preferred_study_times",
            None
        )


        if not preferred_periods:

            preferred_periods = []

            if profile.preferred_study_time:

                preferred_periods = [
                    profile.preferred_study_time
                ]


        # Remove invalid/empty values.

        preferred_periods = [
            period
            for period in preferred_periods
            if period in PERIOD_STARTS
        ]


        # If nothing is configured,
        # start after wake-up.

        if preferred_periods:

            preferred_starts = [
                self.at_time(
                    today,
                    PERIOD_STARTS[period]
                )
                for period in preferred_periods
            ]

            preferred_start = min(
                preferred_starts
            )

        else:

            preferred_start = wake


        # Never start before wake-up.

        start = max(
            preferred_start,
            wake
        )


        # -----------------------------------
        # Break duration
        # -----------------------------------

        break_length = timedelta(
            minutes=profile.break_duration
        )


        # -----------------------------------
        # Today's day name
        # -----------------------------------

        today_name = now.strftime(
            "%A"
        )


        # -----------------------------------
        # Today's commitments
        # -----------------------------------

        commitments = []

        for item in profile.commitments or []:

            if item.get("day") != today_name:
                continue

            try:

                commitment_start = self.at_time(
                    today,
                    item["start"]
                )

                commitment_end = self.at_time(
                    today,
                    item["end"]
                )

            except (
                KeyError,
                ValueError,
                TypeError,
            ):

                continue


            if commitment_end <= commitment_start:

                commitment_end += timedelta(
                    days=1
                )


            commitments.append(
                {
                    "data": item,
                    "start": commitment_start,
                    "end": commitment_end,
                }
            )


        # Sort commitments by start time.

        commitments.sort(
            key=lambda item: item["start"]
        )


        # -----------------------------------
        # Remaining tasks
        # -----------------------------------

        remaining_tasks = [
            task
            for task in (
                profile.tasks or []
            )
            if not task.get("completed", False)
        ]


        # -----------------------------------
        # Generate focus blocks
        # -----------------------------------

        blocks = []


        for task in remaining_tasks:

            # --------------------------------
            # Don't schedule beyond sleep.
            # --------------------------------

            if start + BLOCK_DURATION > sleep:

                break


            # --------------------------------
            # Check commitment collisions.
            # --------------------------------

            moved = True

            while moved:

                moved = False

                block_end = (
                    start +
                    BLOCK_DURATION
                )


                for commitment in commitments:

                    commitment_start = (
                        commitment["start"]
                    )

                    commitment_end = (
                        commitment["end"]
                    )


                    # Collision detected.

                    if (
                        start < commitment_end
                        and
                        block_end > commitment_start
                    ):

                        start = (
                            commitment_end +
                            break_length
                        )

                        moved = True

                        break


            # --------------------------------
            # Check sleep again after moving.
            # --------------------------------

            end = (
                start +
                BLOCK_DURATION
            )


            if end > sleep:

                break


            # --------------------------------
            # Add focus block.
            # --------------------------------

            blocks.append(
                {
                    "title": task.get(
                        "title",
                        "Untitled task"
                    ),

                    "category": task.get(
                        "category",
                        "Other"
                    ),

                    "start": start.strftime(
                        "%H:%M"
                    ),

                    "end": end.strftime(
                        "%H:%M"
                    ),
                }
            )


            # --------------------------------
            # Next block starts after break.
            # --------------------------------

            start = (
                end +
                break_length
            )


        # -----------------------------------
        # Number of tasks not scheduled
        # -----------------------------------

        planned_count = len(blocks)

        unscheduled_count = max(
            0,
            len(remaining_tasks) -
            planned_count
        )


        # -----------------------------------
        # Return planner
        # -----------------------------------

        return Response(
            {
                "method": (
                    "Deterministic schedule "
                    "within your awake hours "
                    "and recurring commitments."
                ),

                "date": (
                    f"{now.strftime('%A, %B')} "
                    f"{now.day}"
                ),

                "generated_at": now.strftime(
                    "%H:%M"
                ),

                "blocks": blocks,

                "commitments": profile.commitments or [],

                "daily_study_target": (
                    profile.daily_study_target
                ),

                "preferred_study_time": (
                    profile.preferred_study_time
                ),

                "preferred_study_times": (
                    preferred_periods
                ),

                "awake_window": {
                    "start": wake.strftime(
                        "%H:%M"
                    ),

                    "end": sleep.strftime(
                        "%H:%M"
                    ),
                },

                "unscheduled_tasks": (
                    unscheduled_count
                ),
            }
        )