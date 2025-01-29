from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer, StudentSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Student, Attendance
import jwt
from datetime import datetime,timedelta, timezone
from rest_framework import status
from django.shortcuts import get_object_or_404

# Create your views here.
'''
class RegisterView(APIView):
    def post(self, request):
        """data recieved from frontend form :{
  "firstname": "John",
  "middlename": "David",
  "lastname": "Smith",
  "class": "1",
  "section": "A",
  "semester": "1",
  "year": "2024",
  "username": "johnsmith123",
  "password": "password123",
  "faceImage": "data:image/jpeg;base64,..."
}
table structure:Here is the table structure:

User
id (primary key)
name
username
password
Role
id (primary key)
name
Admin
id (primary key, foreign key to User)
role (foreign key to Role)
first_name
last_name
Class
class_id (primary key)
name
section
semester
year
admin (foreign key to Admin)
Student
id (primary key, foreign key to User)
first_name
middle_name
last_name
student_class (foreign key to Class)
student_img
Attendance
id (primary key)
status
date_time
student (foreign key to Student)

can you give me the code to save the student data 
in the student table and user registration data in 
user table by making a correct reference of already existing
class here we don't write to class table just a reference is made



"""

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)'''
# class RegisterView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

class RegisterView(APIView):
    def post(self, request):
        print(request.data)
        
        # Extract only the necessary fields for the UserSerializer
        user_data = {
            'name': request.data.get('name'),
            'username': request.data.get('username'),
            'password': request.data.get('password')
        }
        
        print(user_data)

        # Validate and save the user data
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        print("user",user)    

        # Add the user to the request data for the student serializer
        student_data = request.data.copy()
        student_data['user'] = user.id
        print("student_data",student_data)
        print("student_data.get('user')",student_data.get('user'))

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
    def get(self, request, user_id):
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

        # Mock class ranking
        class_ranking = {
            "rank": "Top 15%",  # Replace with actual ranking logic if needed
            "percentile": 85,
        }

        # Last check-in timestamp
        last_check_in = (
            attendance_records[0].date_time.strftime("%Y-%m-%d %I:%M %p") if attendance_records else "N/A"
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

#login
#     const formData = { email: email, password: password };    response true
#           const res = await axios.post(URL, formData);
#           formData = .......

#register
'''
const formData = {
        name: name,
        email: email,
        password: password,
        country: country,
        phone: phone,
        faceimage
     };
const res = await axios.post(URL, formData);
'''
#dashboard


    # const formData = { email: email, password: password };    response true
    # const res = await axios.post(URL, formData);


#forgot password
#  const res = await axios.post(URL, formData);

#form data ---->email



#reset password
#      const res = await axios.post(URL, formData);

'''
id: The value of id from the URL parameters.
token: The value of token from the URL parameters.
password: The value of the newpassword input field from the form.
'''





#data required for dashboard from the backend 
'''

const data = [
  {
    name: "Mon",
    total: 4,
  },
  {
    name: "Tue",
    total: 3,
  },
  {
    name: "Wed",
    total: 5,
  },
  {
    name: "Thu",
    total: 4,
  },
  {
    name: "Fri",
    total: 5,
  },
  {
    name: "Sat",
    total: 2,
  },
  {
    name: "Sun",
    total: 0,
  },
]
'''

'''
{
  "total_attendance": {
    "percentage": 89,
    "change": "+2%"
  },
  "classes_attended": {
    "total": 249,
    "out_of": 280
  },
  "last_check_in": {
    "date": "May 15, 2023",
    "time": "08:45 AM"
  },
  "attendance_streak": {
    "days": 12
  },
  "attendance_overview": [
    {
      "date": "May 1, 2023",
      "attendance": 90
    },
    {
      "date": "May 2, 2023",
      "attendance": 92
    },
    {
      "date": "May 3, 2023",
      "attendance": 88
    },
    ...
  ],
  "recent_check_ins": [
    {
      "date": "May 15, 2023",
      "time": "08:45 AM",
      "status": "On Time"
    },
    {
      "date": "May 14, 2023",
      "time": "09:02 AM",
      "status": "Late"
    },
    {
      "date": "May 13, 2023",
      "time": "08:50 AM",
      "status": "On Time"
    },
    ...
  ]
}
'''




'''
here is the dummy data for the student dashboard for now:
export const studentData = {
    id: "1234",
    first_name: "John",
    middle_name: "Michael",
    last_name: "Doe",
    student_img: "/placeholder.svg",
    student_class: {
      name: "Computer Science",
      section: "A",
      semester: "Fall",
      year: 2025,
    },
    attendance: {
      overall_percentage: 85,
      total_present: 42,
      total_absent: 5,
      total_late: 3,
      breakdown: [
        { name: "Present", value: 42 },
        { name: "Absent", value: 5 },
        { name: "Late", value: 3 },
      ],
    },
    recent_attendance: [
      { date: "2025-01-25", status: "Present" },
      { date: "2025-01-24", status: "Absent" },
      { date: "2025-01-23", status: "Present" },
      { date: "2025-01-22", status: "Late" },
      { date: "2025-01-21", status: "Present" },
    ],
    attendance_trend: [
      { date: "2025-01-19", attendance: 1 },
      { date: "2025-01-20", attendance: 1 },
      { date: "2025-01-21", attendance: 1 },
      { date: "2025-01-22", attendance: 0.5 },
      { date: "2025-01-23", attendance: 1 },
      { date: "2025-01-24", attendance: 0 },
      { date: "2025-01-25", attendance: 1 },
    ],
    class_ranking: {
      rank: "Top 15%",
      percentile: 85,
    },
    last_check_in: "2025-01-25 08:45 AM",
  }

  

  
table structure:Here is the table structure in the backend so donot give me the models.py file 
the database is already made and is robust for now:

User
id (primary key)
name
username
password
Role
id (primary key)
name
Admin
id (primary key, foreign key to User)
role (foreign key to Role)
first_name
last_name
Class
class_id (primary key)
name
section
semester
year
admin (foreign key to Admin)
Student
id (primary key, foreign key to User)
first_name
middle_name
last_name
student_class (foreign key to Class)
student_img
Attendance
id (primary key)
status
date_time
student (foreign key to Student)

can you give me the code to give the data to the frontend from the backend
for the student dashboard with the above table structure and data required
i am doing it in django so give me complete code with views urls or serializers needed
'''