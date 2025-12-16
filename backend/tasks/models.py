from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Task(models.Model):
    STATUS_CHOICES = [
        ('not_done', 'Не выполнена'),
        ('done', 'Выполнена'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assigner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    deadline = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='not_done')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title