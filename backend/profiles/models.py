from django.conf import settings
from django.db import models


class Profile(models.Model):

    STUDY_TIME_CHOICES = [
        ("morning", "Morning"),
        ("afternoon", "Afternoon"),
        ("evening", "Evening"),
        ("night", "Night"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    # Legacy fields retained for existing profiles.
    college = models.CharField(
        max_length=150,
        blank=True,
    )

    branch = models.CharField(
        max_length=100,
        blank=True,
    )

    semester = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    # Permanent routine settings.
    wake_up_time = models.TimeField()

    sleep_time = models.TimeField()

    preferred_study_time = models.CharField(
        max_length=20,
        choices=STUDY_TIME_CHOICES,
    )

    preferred_study_times = models.JSONField(
        default=list,
        blank=True,
    )

    daily_study_target = models.PositiveIntegerField(
        default=2
    )

    break_duration = models.PositiveIntegerField(
        default=25
    )

    # Legacy task/priority storage.
    # New daily plans should use DailyPlan instead.
    tasks = models.JSONField(
        default=list,
        blank=True,
    )

    priorities = models.JSONField(
        default=list,
        blank=True,
    )

    # Permanent recurring commitments.
    commitments = models.JSONField(
        default=list,
        blank=True,
    )

    onboarding_completed = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.user.full_name


class DailyPlan(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="daily_plans",
    )

    date = models.DateField()

    tasks = models.JSONField(
        default=list,
        blank=True,
    )

    priorities = models.JSONField(
        default=list,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"],
                name="unique_daily_plan_per_user_date",
            )
        ]

        ordering = ["-date"]

    def __str__(self):
        return f"{self.user.email} - {self.date}"