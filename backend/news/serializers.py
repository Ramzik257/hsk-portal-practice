# backend/news/serializers.py

from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.ModelSerializer):
    author_email = serializers.ReadOnlyField(source='author.email')

    class Meta:
        model = News
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']