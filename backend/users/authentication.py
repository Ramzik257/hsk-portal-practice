from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print(f"[DEBUG] authenticate вызван с username={username}, password={password is not None}")
        
        if not username:
            print("[DEBUG] username пустой")
            return None
            
        try:
            user = User.objects.get(Q(email=username) | Q(username=username))
            print(f"[DEBUG] Пользователь найден: {user.email}, активен: {user.is_active}")
        except User.DoesNotExist:
            print("[DEBUG] Пользователь не найден")
            return None

        if not user.check_password(password):
            print("[DEBUG] Пароль неверный")
            return None

        if not self.user_can_authenticate(user):
            print("[DEBUG] Пользователь не может аутентифицироваться (не активен)")
            return None

        print("[DEBUG] Аутентификация успешна!")
        return user