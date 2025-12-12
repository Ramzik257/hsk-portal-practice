from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        logger.info(f"Trying to authenticate with email: {username}")
        try:
            user = User.objects.get(email=username)
            logger.info(f"User found: {user.email}")
        except User.DoesNotExist:
            logger.warning(f"No user with email: {username}")
            return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            logger.info("Authentication successful")
            return user
        else:
            logger.warning("Password mismatch or user not active")
            return None