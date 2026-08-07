from django.db import models
from django.conf import settings


class Profile(models.Model):

    STUDY_TIME_CHOICES = [
        ("morning", "Morning"),
        ("afternoon", "Afternoon"),
        ("evening", "Evening"),
        ("night", "Night"),
    ]

    GOAL_CHOICES = [
        ("placements", "Placements"),
        ("semester_exam", "Semester Exam"),
        ("gate", "GATE"),
        ("higher_studies", "Higher Studies"),
        ("other", "Other"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    college = models.CharField(max_length=150)

    branch = models.CharField(max_length=100)

    semester = models.PositiveIntegerField()

    wake_up_time = models.TimeField()

    sleep_time = models.TimeField()

    preferred_study_time = models.CharField(
        max_length=20,
        choices=STUDY_TIME_CHOICES,
    )
    daily_study_target = models.PositiveIntegerField(default=2)

    goal = models.CharField(
        max_length=30,
        choices=GOAL_CHOICES,
    )

    onboarding_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.full_name