from datetime import datetime

from rest_framework import serializers

from .models import Profile


TASK_CATEGORIES = {
    "Assignment", "Project", "Study Topic", "Placement", "Internship",
    "Meeting", "Personal", "Reminder", "Other",
}
COMMITMENT_CATEGORIES = {"Class", "Work", "Meeting", "Personal", "Exercise", "Other"}
DAYS = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}


class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(required=False, read_only=True)
    title = serializers.CharField(max_length=200)
    category = serializers.ChoiceField(choices=sorted(TASK_CATEGORIES))
    completed = serializers.BooleanField(required=False, default=False)

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("A task title is required.")
        return value


class CommitmentSerializer(serializers.Serializer):
    day = serializers.ChoiceField(choices=sorted(DAYS))
    start = serializers.CharField()
    end = serializers.CharField()
    title = serializers.CharField(max_length=200)
    category = serializers.ChoiceField(choices=sorted(COMMITMENT_CATEGORIES))

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("A commitment title is required.")
        return value

    def validate(self, attrs):
        try:
            start = datetime.strptime(attrs["start"], "%H:%M")
            end = datetime.strptime(attrs["end"], "%H:%M")
        except ValueError:
            raise serializers.ValidationError("Times must use HH:MM format.")
        if end <= start:
            raise serializers.ValidationError({"end": "End time must be after start time."})
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True)
    commitments = CommitmentSerializer(many=True, required=False)
    priorities = serializers.ListField(child=serializers.CharField(max_length=100), allow_empty=False)
    preferred_study_times = serializers.ListField(
    child=serializers.ChoiceField(
        choices=Profile.STUDY_TIME_CHOICES
    ),
    allow_empty=False,
)

    class Meta:
        model = Profile
        exclude = ["user", "college", "branch", "semester"]
        read_only_fields = ["onboarding_completed"]

    def validate_preferred_study_times(self, value):
        if not value:
            raise serializers.ValidationError(
                "Select at least one preferred study period."
            )
        return list(dict.fromkeys(value))
    def validate_priorities(self, value):
        values = [item.strip() for item in value if item.strip()]
        if not values:
            raise serializers.ValidationError("Select at least one priority.")
        return list(dict.fromkeys(values))

    def validate_daily_study_target(self, value):
        if value < 1:
            raise serializers.ValidationError("Daily study target must be positive.")
        return value

    def validate_break_duration(self, value):
        if value < 1:
            raise serializers.ValidationError("Break duration must be positive.")
        return value

    def create(self, validated_data):
        from uuid import uuid4
        validated_data["tasks"] = [{"id": uuid4().hex, **task} for task in validated_data["tasks"]]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from uuid import uuid4
        if "tasks" in validated_data:
            existing_ids = [task.get("id") for task in instance.tasks]
            validated_data["tasks"] = [
                {"id": existing_ids[index] if index < len(existing_ids) else uuid4().hex, **task}
                for index, task in enumerate(validated_data["tasks"])
            ]
        return super().update(instance, validated_data)
