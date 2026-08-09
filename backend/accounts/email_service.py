from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse

from .tokens import email_verification_token


def send_verification_email(user):

    token = email_verification_token.make_token(user)

    verification_url = (
        f"{settings.FRONTEND_URL}"
        f"/verify-email/{user.pk}/{token}"
    )

    subject = "Verify your TinyPal email"

    message = f"""
Hi {user.full_name},

Welcome to TinyPal.

Your account is almost ready.

Please verify your email address by opening this link:

{verification_url}

If you did not create a TinyPal account, you can safely ignore this email.

— TinyPal
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )