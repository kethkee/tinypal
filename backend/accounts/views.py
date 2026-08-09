from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .email_service import send_verification_email
from .serializers import RegisterSerializer
from .tokens import email_verification_token
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializers import TinyPalTokenObtainPairSerializer

User = get_user_model()

class TinyPalTokenObtainPairView(
    TokenObtainPairView
):

    serializer_class = TinyPalTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):

    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        send_verification_email(user)

        return Response(
            {
                "success": True,
                "message": (
                    "Account created. "
                    "Please check your email to verify your account."
                ),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request, user_id, token):

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Invalid verification link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.email_verified:
            return Response(
                {
                    "success": True,
                    "message": "Email is already verified."
                }
            )

        if not email_verification_token.check_token(user, token):
            return Response(
                {
                    "success": False,
                    "message": "This verification link is invalid or expired."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.email_verified = True
        user.save(update_fields=["email_verified"])

        return Response(
            {
                "success": True,
                "message": "Email verified successfully."
            }
        )