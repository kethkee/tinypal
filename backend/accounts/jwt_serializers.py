from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class TinyPalTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    def validate(self, attrs):

        data = super().validate(attrs)

        if not self.user.email_verified:
            raise serializers.ValidationError(
                {
                    "email_verified": (
                        "Please verify your email before logging in."
                    )
                }
            )

        return data