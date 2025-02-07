import os
import json
import base64
import jwt
from datetime import datetime, timedelta, timezone

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView

from .models import User, Student, Attendance
from .serializers import UserSerializer, StudentSerializer

from deepface import DeepFace

class RegisterView(APIView):
    def post(self, request):
        # print(request.data)
        
        # Extract only the necessary fields for the UserSerializer
        user_data = {
            'name': request.data.get('first_name'),
            'username': request.data.get('username'),
            'password': request.data.get('password')
        }
        
        print(user_data)

        # Validate and save the user data
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        print("user", user)

        # Add the user to the request data for the student serializer
        student_data = request.data.copy()
        student_data['user'] = user.id

        # Decode the base64 image and save it as a file
        student_img_base64 = student_data.get('student_img')
        if student_img_base64:
            format, imgstr = student_img_base64.split(';base64,')
            ext = format.split('/')[-1]
            img_data = ContentFile(base64.b64decode(imgstr), name=f'user_{user.id}.{ext}')
            student_data['student_img'] = img_data

        print("student_data", student_data)
        print("student_data.get('user')", student_data.get('user'))

        # Validate and save the student data
        student_serializer = StudentSerializer(data=student_data, context={'request': request})
        student_serializer.is_valid(raise_exception=True)
        student = student_serializer.save()

        # Combine the response data
        response_data = {
            'user': user_serializer.data,
            'student': student_serializer.data
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = User.objects.filter(username=username).first()
        
        if user is None:
            raise AuthenticationFailed('User not found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')
        
            
        payload = {
            'id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
            'iat': datetime.now(timezone.utc)
        }
        
        print("payload", payload)
        
        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True, 
            samesite='Lax', 
            secure=True, 
            expires=datetime.now(timezone.utc) + timedelta(minutes=60)  # Optional: exact expiry time
        )   
        
        response.data = {
            'username': user.username,
            'user_id': user.id,
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
        
        user = User.objects.filter(id=payload['id']).first()
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


class StudentDashboardView(APIView):
    def get(self, response, user_id):
        # Fetch student data
        student = get_object_or_404(Student, user_id=user_id)
        student_class = student.student_class

        # Fetch attendance records
        attendance_records = Attendance.objects.filter(student=student).order_by('-date_time')

        total_present = attendance_records.filter(status='Present').count()
        total_absent = attendance_records.filter(status='Absent').count()
        total_late = attendance_records.filter(status='Late').count()
        total_days = total_present + total_absent + total_late

        # Calculate overall attendance percentage
        overall_percentage = round((total_present / total_days) * 100, 2) if total_days > 0 else 0

        # Attendance breakdown
        attendance_breakdown = [
            {"name": "Present", "value": total_present},
            {"name": "Absent", "value": total_absent},
            {"name": "Late", "value": total_late},
        ]

        # Recent attendance (last 5 records)
        recent_attendance = [
            {"date": att.date_time.strftime("%Y-%m-%d"), "status": att.status}
            for att in attendance_records[:5]
        ]

        # Attendance trend (last 7 records)
        attendance_trend = [
            {
                "date": att.date_time.strftime("%Y-%m-%d"),
                "attendance": 1 if att.status == 'Present' else (0.5 if att.status == 'Late' else 0),
            }
            for att in attendance_records[:7]
        ]

        # Calculate class ranking
        classmates = Student.objects.filter(student_class_id=student_class)
        total_classmates = classmates.count()

        # Calculate the attendance percentage for each classmate
        classmate_attendance = []
        for classmate in classmates:
            classmate_records = Attendance.objects.filter(student=classmate)
            classmate_present = classmate_records.filter(status='Present').count()
            classmate_absent = classmate_records.filter(status='Absent').count()
            classmate_late = classmate_records.filter(status='Late').count()
            classmate_total_days = classmate_present + classmate_absent + classmate_late
            classmate_percentage = (classmate_present / classmate_total_days) * 100 if classmate_total_days > 0 else 0
            classmate_attendance.append((classmate.user_id, classmate_percentage))

        # Sort classmates by attendance percentage in descending order
        classmate_attendance.sort(key=lambda x: x[1], reverse=True)

        # Find the rank of the current student
        student_rank = next((index for index, (id, _) in enumerate(classmate_attendance) if id == student.user_id), None)
        student_rank_actual = student_rank + 1 if student_rank is not None else total_classmates

        # Class ranking
        class_ranking = {
            "rank": student_rank_actual,
            "total": total_classmates,
        }
        from django.utils import timezone
        # Last check-in timestamp
        last_check_in = (
            
            timezone.localtime(attendance_records[0].date_time).strftime("%Y-%m-%d %I:%M %p") if attendance_records else "N/A"
        )

        # Construct response data
        data = {
            "id": student.user.id,
            "first_name": student.first_name,
            "middle_name": student.middle_name if student.middle_name else "",
            "last_name": student.last_name,
            "student_img": student.student_img.url if student.student_img else "/placeholder.svg",
            "student_class": {
                "name": student_class.name,
                "section": student_class.section,
                "semester": student_class.semester,
                "year": student_class.year,
            },
            "attendance": {
                "overall_percentage": overall_percentage,
                "total_present": total_present,
                "total_absent": total_absent,
                "total_late": total_late,
                "breakdown": attendance_breakdown,
            },
            "recent_attendance": recent_attendance,
            "attendance_trend": attendance_trend,
            "class_ranking": class_ranking,
            "last_check_in": last_check_in,
        }

        return Response(data)

@method_decorator(csrf_exempt, name='dispatch')
class FaceVerification(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            image_data = data.get('image_data')

            if not student_id or not image_data:
                return JsonResponse({'error': 'Invalid data'}, status=400)

            # Get the student image from the database
            try:
                student = Student.objects.get(user_id=student_id)
                print(student.student_img.path)
            except Student.DoesNotExist:
                return JsonResponse({'error': 'Student not found'}, status=404)

            # Decode the base64 image data
            image_data = base64.b64decode(image_data)
            temp_image_path = '/tmp/temp_image.jpg'
            with open(temp_image_path, 'wb') as f:
                f.write(image_data)

            verified = False
            # Perform the verification
            verification = DeepFace.verify(img1_path=student.student_img.path, img2_path=temp_image_path)
            verification = DeepFace.verify(
                img1_path=student.student_img.path, 
                img2_path=temp_image_path,  
                model_name="ArcFace",  # More robust model
                detector_backend="retinaface",  # Best for face alignment
                distance_metric="euclidean_l2",  # Stricter distance measure
                enforce_detection=True,  # Avoid using blank images if no face is detected
                align=True  # Corrects face alignment issues
            )
            print(verification)
            # Custom strict threshold (reduce false positives)
            distance = verification["distance"]
            threshold = 1  # Adjust threshold to a stricter value

            if distance < threshold:
                verified = True
            else:
                verified = False
            
            from django.utils import timezone
            
            current_time = timezone.localtime(timezone.now())
            
            college_start_time = current_time.replace(hour=11, minute=0, second=0)
            print("college_start_time", college_start_time)
            college_end_time = current_time.replace(hour=16, minute=0, second=0)
            print("college_end_time", college_end_time)
            
            if verified:
                if current_time < college_start_time:
                    attendance_status = Attendance.PRESENT
                else:
                    attendance_status = Attendance.LATE
                Attendance.objects.create(status=attendance_status, student=student, date_time=current_time)
                print("current_time", current_time)
                return JsonResponse({'verified': True, 'attendance': attendance_status}, status=200)
            else:
                return JsonResponse({'verified': False}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        