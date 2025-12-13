from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def task_list_view(request):
    return JsonResponse([], safe=False)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tasks/', task_list_view),
]