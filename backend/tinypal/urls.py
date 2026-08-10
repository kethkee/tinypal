from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import TinyPalTokenObtainPairView


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    # JWT login
    path(
        "api/token/",
        TinyPalTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    # JWT refresh
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Profile + tasks + today's plan
    path(
        "api/profile/",
        include("profiles.urls"),
    ),

    # Generated planner
    path(
        "api/planner/",
        include("planner.urls"),
    ),
]