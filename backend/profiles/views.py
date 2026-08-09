from uuid import uuid4

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import ProfileSerializer, TaskSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({"detail": "Profile has not been created."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProfileSerializer(profile).data)

    def post(self, request):
        profile = getattr(request.user, "profile", None)
        created = profile is None
        serializer = ProfileSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save(user=request.user, onboarding_completed=True)
        return Response(ProfileSerializer(profile).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self, request):
        try:
            return request.user.profile
        except Profile.DoesNotExist:
            return None

    def get(self, request):
        profile = self.get_profile(request)
        if not profile:
            return Response({"detail": "Complete onboarding before managing tasks."}, status=status.HTTP_404_NOT_FOUND)
        return Response(profile.tasks)

    def post(self, request):
        profile = self.get_profile(request)
        if not profile:
            return Response({"detail": "Complete onboarding before managing tasks."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = {"id": uuid4().hex, **serializer.validated_data}
        profile.tasks = [*profile.tasks, task]
        profile.save(update_fields=["tasks"])
        return Response(task, status=status.HTTP_201_CREATED)


class TaskDetailView(TaskListView):
    def find_task(self, profile, task_id):
        for index, task in enumerate(profile.tasks):
            if task.get("id") == task_id:
                return index, task
        return None, None

    def patch(self, request, task_id):
        profile = self.get_profile(request)
        if not profile:
            return Response({"detail": "Profile has not been created."}, status=status.HTTP_404_NOT_FOUND)
        index, task = self.find_task(profile, task_id)
        if task is None:
            return Response({"detail": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(data={**task, **request.data}, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = {"id": task_id, **serializer.validated_data}
        tasks = list(profile.tasks)
        tasks[index] = updated
        profile.tasks = tasks
        profile.save(update_fields=["tasks"])
        return Response(updated)

    def delete(self, request, task_id):
        profile = self.get_profile(request)
        if not profile:
            return Response({"detail": "Profile has not been created."}, status=status.HTTP_404_NOT_FOUND)
        index, task = self.find_task(profile, task_id)
        if task is None:
            return Response({"detail": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        profile.tasks = [item for position, item in enumerate(profile.tasks) if position != index]
        profile.save(update_fields=["tasks"])
        return Response(status=status.HTTP_204_NO_CONTENT)
