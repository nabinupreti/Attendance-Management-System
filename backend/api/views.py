from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt
from datetime import datetime,timedelta, timezone

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

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

