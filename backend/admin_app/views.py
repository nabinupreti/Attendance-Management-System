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
from django.db.models import Count

from django.http import JsonResponse, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from api.models import Attendance, Class, Student
import csv
from datetime import datetime



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


class ClassCountView(APIView):
    def get(self, request):
        count = Class.objects.count()
        return Response({"total_classes": count}, status=status.HTTP_200_OK)

# Student Views
class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentCountView(APIView):
    def get(self, request):
        count = Student.objects.count()
        return Response({"total_students": count}, status=status.HTTP_200_OK)

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


# # View for recent attendance
# class RecentAttendanceView(View):
#     def get(self, request):
#         recent_attendance = Attendance.objects.order_by("-date_time")[:10].values()
#         return JsonResponse(list(recent_attendance), safe=False)
    
class RecentAttendanceView(View):
    def get(self, request):
        recent_attendance = Attendance.objects.order_by("-date_time")[:10]
        attendance_data = []
        
        for record in recent_attendance:
            attendance_data.append({
                "id": record.id,
                "status": record.status,
                # "date_time": record.date_time.isoformat(),
                # "student_id": record.student_id,
                "first_name": record.student.first_name,
                "last_name": record.student.last_name,
                "username": record.student.user.username
            })
        
        return JsonResponse(attendance_data, safe=False)

# View for attendance trends
class AttendanceTrendView(View):
    def get(self, request):
        trend_data = (
            Attendance.objects.values("status")
            .annotate(total=Count("status"))
            .order_by("-total")
        )
        return JsonResponse(list(trend_data), safe=False)

# View to generate attendance report
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceReportView(View):
    def post(self, request):
        data = json.loads(request.body)
        class_id = data.get("classId")
        start_date = data.get("startDate")
        end_date = data.get("endDate")

        if not class_id or not start_date or not end_date:
            return JsonResponse({"error": "Missing parameters"}, status=400)

        attendance_records = Attendance.objects.filter(
            student__student_class=class_id,
            date_time__range=[start_date, end_date]
        )

        # Group attendance records by date
        grouped_records = {}
        for record in attendance_records:
            date_str = record.date_time.date().isoformat()
            if date_str not in grouped_records:
                grouped_records[date_str] = {
                    "class": record.student.student_class.name,
                    "totalStudents": 0,
                    "present": 0,
                    "absent": 0,
                    "late": 0,
                    "attendanceRate": 0,
                }
            grouped_records[date_str]["totalStudents"] += 1
            if record.status == "Present":
                grouped_records[date_str]["present"] += 1
            elif record.status == "Absent":
                grouped_records[date_str]["absent"] += 1
            elif record.status == "Late":
                grouped_records[date_str]["late"] += 1

        # Calculate attendance rate for each day
        for date_str, data in grouped_records.items():
            total_students = data["totalStudents"]
            present_count = data["present"]
            data["attendanceRate"] = int((present_count / total_students * 100)) if total_students else 0

        # Convert grouped records to a list
        response_data = [
            {
                "date": date_str,
                "class": data["class"],
                "totalStudents": data["totalStudents"],
                "present": data["present"],
                "absent": data["absent"],
                "late": data["late"],
                "attendanceRate": data["attendanceRate"],
            }
            for date_str, data in grouped_records.items()
        ]

        return JsonResponse(response_data, safe=False)

# View to export attendance report as CSV
@method_decorator(csrf_exempt, name="dispatch")
class AttendanceExportView(View):
    def post(self, request):
        data = json.loads(request.body)
        class_id = data.get("classId")
        start_date = data.get("startDate")
        end_date = data.get("endDate")

        attendance_records = Attendance.objects.filter(
            class_id=class_id,
            date__range=[start_date, end_date]
        )

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="attendance_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow(["Student", "Class", "Date", "Status"])
        
        for record in attendance_records:
            writer.writerow([record.student.user.username, record.class_id.name, record.date, record.status])

        return response
