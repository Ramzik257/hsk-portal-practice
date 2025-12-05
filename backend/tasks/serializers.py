
from rest_framework import serializers
from .models import Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):
    assigner = serializers.SlugRelatedField(slug_field='email', queryset=User.objects.all())
    assignee = serializers.SlugRelatedField(slug_field='email', queryset=User.objects.all())

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']