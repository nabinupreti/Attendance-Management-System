from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import AdminUser 
import jwt
from datetime import datetime,timedelta, timezone
from rest_framework import status
from rest_framework import generics
from api.models import Class, Student, Attendance
from .serializers import ClassSerializer, StudentSerializer, AttendanceSerializer
from django.http import HttpResponse
import csv

class RegisterView(APIView):
    def post(self, request):
        # Validate and save the user data
        user_serializer = UserSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        return Response(user_serializer.data)
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = AdminUser.objects.filter(username=username).first()
        
        if user is None:
            raise AuthenticationFailed('User not found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')
        
            
        payload = {
            'id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
            'iat': datetime.now(timezone.utc)
        }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        
        response.set_cookie(key='jwt', value=token, httponly=True)
        
        response.data = {
            'username': user.username,
            'jwt': token
        }
        
        return response
    
class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        
        user = AdminUser.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        
        return Response(serializer.data)
        
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

# Class Views
class ClassListView(generics.ListAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ClassCreateView(generics.CreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ClassUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = "class_id"


class ClassDeleteView(generics.DestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = "class_id"


# Student Views
class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


# Attendance Views
class AttendanceListView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class AttendanceUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"


# Reports Views
class AttendanceReportView(APIView):
    def post(self, request):
        class_id = request.data.get("classId")
        start_date = request.data.get("startDate")
        end_date = request.data.get("endDate")

        if not class_id or not start_date or not end_date:
            return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

        attendance_records = Attendance.objects.filter(student__student_class__id=class_id, date__range=[start_date, end_date])
        total_students = attendance_records.count()
        present_count = attendance_records.filter(status="Present").count()
        absent_count = attendance_records.filter(status="Absent").count()
        late_count = attendance_records.filter(status="Late").count()

        attendance_rate = (present_count / total_students * 100) if total_students else 0

        return Response(
            {
                "class": attendance_records.first().student.student_class.name if total_students else "N/A",
                "totalStudents": total_students,
                "present": present_count,
                "absent": absent_count,
                "late": late_count,
                "attendanceRate": attendance_rate,
            },
            status=status.HTTP_200_OK,
        )


class AttendanceExportView(APIView):
    def post(self, request):
        return Response({"message": "Export functionality not implemented yet"}, status=status.HTTP_200_OK)

'''
#Class View
class ClassListView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class ClassDetailView(generics.RetrieveAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = "class_id"

class ClassCreateView(generics.CreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

class ClassUpdateView(generics.UpdateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = "class_id"

class ClassDeleteView(generics.DestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    lookup_field = "class_id"

class StudentListView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetailView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = "student_id"

class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentUpdateView(generics.UpdateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = "student_id"

class StudentDeleteView(generics.DestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = "student_id"



class AttendanceListView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceDetailView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"

class AttendanceCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceUpdateView(generics.UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    lookup_field = "attendance_id"

class AttendanceBulkUpdateView(APIView):
    def post(self, request):
        for record in request.data:
            attendance = Attendance.objects.get(id=record["attendance_id"])
            attendance.status = record["status"]
            attendance.save()
        return Response({"message": "Bulk update successful"}, status=status.HTTP_200_OK)

'''