from django.db import models
from django.conf import settings


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

    # Retained as optional legacy fields for existing profiles.
    college = models.CharField(max_length=150, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    semester = models.PositiveIntegerField(null=True, blank=True)

    wake_up_time = models.TimeField()
    sleep_time = models.TimeField()

    preferred_study_time = models.CharField(
        max_length=20,
        choices=STUDY_TIME_CHOICES,
    )
    daily_study_target = models.PositiveIntegerField(default=2)
    break_duration = models.PositiveIntegerField(default=25)
    tasks = models.JSONField(default=list, blank=True)
    priorities = models.JSONField(default=list, blank=True)
    commitments = models.JSONField(default=list, blank=True)

    onboarding_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.full_name
