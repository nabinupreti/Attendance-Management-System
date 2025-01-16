from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password  # Used for comparing hashed passwords
from api.models import Student  # Make sure to import Student model

class StudentLoginView(APIView):
    """
    Endpoint for student login.
    """
    def post(self, request):
        # Get username and password from request data
        username = request.data.get('username')
        password = request.data.get('password')
        print("--------------"+username, password)

        # Validate input fields
        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Retrieve student object using the username
            student = Student.objects.get(username=username)

            # Check if the provided password matches the stored hash
            if (password==student.password):
                # Password is correct
                return Response(
                    {"message": "Login successful", "student_id": student.student_id},
                    status=status.HTTP_200_OK
                )
            else:
                # Invalid credentials
                return Response(
                    {"error": "Authentication failed"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Student.DoesNotExist:
            # Username not found, returning generic authentication error
            return Response(
                {"error": "Authentication failed"},
                status=status.HTTP_401_UNAUTHORIZED
            )
