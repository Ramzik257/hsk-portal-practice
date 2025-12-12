# backend/users/admin.py

from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'role', 'is_superuser']
    list_filter = ['role', 'is_superuser']
    search_fields = ['email', 'username']