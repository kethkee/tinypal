from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from profiles.models import Profile


PERIOD_STARTS = {"morning": "08:00", "afternoon": "13:00", "evening": "18:00", "night": "20:00"}
BLOCK_DURATION = timedelta(minutes=60)


class PlannerView(APIView):
    """Deterministic schedule that stays inside the user's awake hours."""

    permission_classes = [IsAuthenticated]

    @staticmethod
    def at_time(day, value):
        return datetime.combine(day, datetime.strptime(value, "%H:%M").time())

    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"detail": "Complete onboarding to generate a plan."}, status=404)

        now = timezone.localtime(timezone.now())
        today = now.date()
        wake = self.at_time(today, profile.wake_up_time.strftime("%H:%M"))
        sleep = self.at_time(today, profile.sleep_time.strftime("%H:%M"))
        # A sleep time at or before wake time belongs to the following calendar day.
        if sleep <= wake:
            sleep += timedelta(days=1)

        preferred_start = self.at_time(today, PERIOD_STARTS[profile.preferred_study_time])
        # Do not begin before waking or after the available awake window.
        start = max(wake, preferred_start)
        if start + BLOCK_DURATION > sleep:
            start = sleep

        break_length = timedelta(minutes=profile.break_duration)
        today_name = now.strftime("%A")
        commitments = []
        for item in profile.commitments:
            if item["day"] != today_name:
                continue
            commitment_start = self.at_time(today, item["start"])
            commitment_end = self.at_time(today, item["end"])
            if commitment_end <= commitment_start:
                commitment_end += timedelta(days=1)
            commitments.append((commitment_start, commitment_end))

        remaining_tasks = [task for task in profile.tasks if not task.get("completed")]
        blocks = []
        for task in remaining_tasks[:profile.daily_study_target]:
            # If a focus block collides with a commitment, move to that commitment's end.
            moved = True
            while moved:
                moved = False
                end = start + BLOCK_DURATION
                for commitment_start, commitment_end in commitments:
                    if start < commitment_end and end > commitment_start:
                        start = commitment_end + break_length
                        moved = True
                        break
            end = start + BLOCK_DURATION
            if end > sleep:
                break
            blocks.append({
                "title": task["title"],
                "category": task["category"],
                "start": start.strftime("%H:%M"),
                "end": end.strftime("%H:%M"),
            })
            start = end + break_length

        planned_count = len(blocks)
        return Response({
            "method": "Deterministic schedule within your awake hours and recurring commitments.",
            "blocks": blocks,
            "commitments": profile.commitments,
            "date": f"{now.strftime('%A, %B')} {now.day}",
            "generated_at": now.strftime("%H:%M"),
            "awake_window": {"start": wake.strftime("%H:%M"), "end": sleep.strftime("%H:%M")},
            "unscheduled_tasks": max(0, min(len(remaining_tasks), profile.daily_study_target) - planned_count),
        })
