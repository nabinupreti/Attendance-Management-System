from django.http import JsonResponse
from django.views import View

class SimpleJsonView(View):
    def get(self, request, *args, **kwargs):
        data = {
            'message': 'Hello, world! im inside classes/views.py'
        }
        return JsonResponse(data)