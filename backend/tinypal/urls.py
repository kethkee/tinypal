from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import TinyPalTokenObtainPairView


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.urls")
    ),

    path(
        "api/token/",
        TinyPalTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "api/profile/",
        include("profiles.urls")
    ),

    path(
        "api/planner/",
        include("planner.urls")
    ),
]