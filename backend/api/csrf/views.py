from rest_framework.views import APIView
from rest_framework.response import Response

class CsrfView(APIView):
    def get(self, request):
        return Response({"message": "This is a simple JSON response from csrf"}, status=200)