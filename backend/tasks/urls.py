from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from django.urls import path, include


router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
]