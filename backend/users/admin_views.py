# backend/users/admin_views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import User

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class UserListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.objects.all().values('id', 'email', 'role', 'username')
        return Response(list(users))

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'employee')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=400)

        user = User.objects.create_user(
            email=email,
            username=email.split('@')[0],
            password=password,
            role=role
        )
        return Response({
            'id': user.id,
            'email': user.email,
            'role': user.role
        }, status=201)

class UserDetailView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        role = request.data.get('role')
        if role not in ['admin', 'employee']:
            return Response({'error': 'Invalid role'}, status=400)

        user.role = role
        user.save()
        return Response({'id': user.id, 'email': user.email, 'role': user.role})