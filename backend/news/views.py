from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import News
from .serializers import NewsSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Проверяем только если пользователь аутентифицирован
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        # Ленивая проверка роли
        return getattr(request.user, 'role', None) == 'admin'

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) != 'admin':
            raise PermissionDenied("Only admin can delete news.")
        return super().destroy(request, *args, **kwargs)