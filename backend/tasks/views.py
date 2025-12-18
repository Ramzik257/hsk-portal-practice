# backend/tasks/views.py

from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Админ может всё
        if request.user.role == 'admin':
            return True
        # Создатель задачи — может редактировать/удалять
        return obj.assigner == request.user

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        # Админ видит всё, сотрудник — только свои
        if self.request.user.role == 'admin':
            return Task.objects.all()
        return Task.objects.filter(assignee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(assigner=self.request.user)