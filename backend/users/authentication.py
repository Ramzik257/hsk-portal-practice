# backend/users/authentication.py

import logging
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

logger = logging.getLogger(__name__)
User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        logger.info(f"Trying to authenticate: {username}")
        if not username:
            return None
        try:
            user = User.objects.get(Q(email=username) | Q(username=username))
            logger.info(f"User found: {user.email}")
        except User.DoesNotExist:
            logger.error("User not found")
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            logger.info("Authentication successful")
            return user
        logger.error("Password mismatch or user inactive")
        return None