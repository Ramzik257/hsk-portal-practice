from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]  # ← обязательно!

    def get_queryset(self):
        return Task.objects.filter(assignee=self.request.user)

    def perform_create(self, serializer):
        serializer.save(assigner=self.request.user)