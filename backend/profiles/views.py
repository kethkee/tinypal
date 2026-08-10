from uuid import uuid4

from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyPlan, Profile
from .serializers import (
    DailyPlanSerializer,
    ProfileSerializer,
    TaskSerializer,
)


class ProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        try:
            profile = request.user.profile

        except Profile.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Profile has not been created."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            ProfileSerializer(profile).data
        )

    def post(self, request):

        profile = getattr(
            request.user,
            "profile",
            None,
        )

        created = profile is None

        serializer = ProfileSerializer(
            profile,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        profile = serializer.save(
            user=request.user,
            onboarding_completed=True,
        )

        # Only create the first daily plan when
        # onboarding creates the profile.
        #
        # Editing permanent settings later will NOT
        # destroy today's tasks.
        if created:

            today = timezone.localdate()

            DailyPlan.objects.get_or_create(
                user=request.user,
                date=today,
                defaults={
                    "tasks": profile.tasks,
                    "priorities": profile.priorities,
                },
            )

        return Response(
            ProfileSerializer(profile).data,
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            ),
        )


class TodayPlanView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        today = timezone.localdate()

        try:
            plan = DailyPlan.objects.get(
                user=request.user,
                date=today,
            )

        except DailyPlan.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Today's plan has not been created yet."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            DailyPlanSerializer(plan).data
        )

    def post(self, request):

        today = timezone.localdate()

        existing = DailyPlan.objects.filter(
            user=request.user,
            date=today,
        ).first()

        if existing:

            return Response(
                DailyPlanSerializer(existing).data,
                status=status.HTTP_200_OK,
            )

        serializer = DailyPlanSerializer(
            data=request.data or {}
        )

        serializer.is_valid(
            raise_exception=True
        )

        plan = serializer.save(
            user=request.user,
            date=today,
        )

        return Response(
            DailyPlanSerializer(plan).data,
            status=status.HTTP_201_CREATED,
        )

class TaskListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_plan(self, request):

        return DailyPlan.objects.filter(
            user=request.user,
            date=timezone.localdate(),
        ).first()

    def get(self, request):

        plan = self.get_plan(request)

        if not plan:

            return Response(
                {
                    "detail":
                    "Create today's plan first."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(plan.tasks)

    def post(self, request):

        plan = self.get_plan(request)

        if not plan:

            return Response(
                {
                    "detail":
                    "Create today's plan first."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TaskSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        task = {
            "id": uuid4().hex,
            **serializer.validated_data,
        }

        plan.tasks = [
            *plan.tasks,
            task,
        ]

        plan.save(
            update_fields=[
                "tasks",
                "updated_at",
            ]
        )

        return Response(
            task,
            status=status.HTTP_201_CREATED,
        )


class TaskDetailView(TaskListView):

    def find_task(
        self,
        plan,
        task_id,
    ):

        for index, task in enumerate(
            plan.tasks
        ):

            if task.get("id") == task_id:
                return index, task

        return None, None

    def patch(
        self,
        request,
        task_id,
    ):

        plan = self.get_plan(request)

        if not plan:

            return Response(
                {
                    "detail":
                    "Create today's plan first."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        index, task = self.find_task(
            plan,
            task_id,
        )

        if task is None:

            return Response(
                {
                    "detail":
                    "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TaskSerializer(
            data={
                **task,
                **request.data,
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        updated = {
            "id": task_id,
            **serializer.validated_data,
        }

        tasks = list(plan.tasks)

        tasks[index] = updated

        plan.tasks = tasks

        plan.save(
            update_fields=[
                "tasks",
                "updated_at",
            ]
        )

        return Response(updated)

    def delete(
        self,
        request,
        task_id,
    ):

        plan = self.get_plan(request)

        if not plan:

            return Response(
                {
                    "detail":
                    "Create today's plan first."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        index, task = self.find_task(
            plan,
            task_id,
        )

        if task is None:

            return Response(
                {
                    "detail":
                    "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        plan.tasks = [
            item
            for position, item
            in enumerate(plan.tasks)
            if position != index
        ]

        plan.save(
            update_fields=[
                "tasks",
                "updated_at",
            ]
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )