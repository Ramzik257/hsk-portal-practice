from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET"])
def task_list_view(request):
    # Просто возвращаем пустой список
    return JsonResponse([], safe=False)