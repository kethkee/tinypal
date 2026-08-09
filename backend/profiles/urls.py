from django.urls import path
from .views import ProfileView, TaskDetailView, TaskListView

urlpatterns = [
    path("", ProfileView.as_view(), name="profile"),
    path("tasks/", TaskListView.as_view(), name="task-list"),
    path("tasks/<str:task_id>/", TaskDetailView.as_view(), name="task-detail"),
]
