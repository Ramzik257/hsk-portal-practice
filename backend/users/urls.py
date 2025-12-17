# backend/users/urls.py

from django.urls import path
from .views import LoginView, RegisterView
from .admin_views import UserListView, UserDetailView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
]