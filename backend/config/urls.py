# backend/config/urls.py

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),   # → /api/login/
    path('api/', include('tasks.urls')),   # → /api/tasks/
]