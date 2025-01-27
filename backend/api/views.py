from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer, StudentSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt
from datetime import datetime,timedelta, timezone
from rest_framework import status

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


#data required for the registration from the backend

