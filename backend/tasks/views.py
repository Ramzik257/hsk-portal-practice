# backend/tasks/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response([])  # Пустой список задач

    def post(self, request):
        return Response({"id": 1, "title": "Задача создана", "status": "not_done"})