from django.urls import path

from .views import PlannerView

urlpatterns = [path("", PlannerView.as_view(), name="planner")]
