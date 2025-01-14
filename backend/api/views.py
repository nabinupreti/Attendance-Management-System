from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

@api_view(['GET'])
def getData(request):
    data = {
        'name': 'John Doe',
        'age': 30
    }
    return Response(data)