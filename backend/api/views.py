from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import Student
from .models import Class
from .serializers import ClassSerializer


@api_view(['GET'])
def getData(request):
    data = {
        'name': 'John Doe',
        'age': 30
    }
    return Response(data)

@api_view(['GET'])
def get_students(request):
    students = Student.objects.all()
    data = []
    for student in students:
        student_class = student.student_class
        class_data = ClassSerializer(student_class).data
        data.append({
            'student_id': student.student_id,
            'first_name': student.first_name,
            'middle_name': student.middle_name,
            'last_name': student.last_name,
            'student_class': class_data,
        })
        
    return Response(data)

@api_view(['GET'])
def get_student_by_id(request, student_id):
    """
    Get student by ID
    """
    try:
        student = Student.objects.get(pk=student_id)
        student_class = student.student_class
        class_data = ClassSerializer(student_class).data
        data = {
            'student_id': student.student_id,
            'first_name': student.first_name,
            'middle_name': student.middle_name,
            'last_name': student.last_name,
            'student_class': class_data,
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    
@api_view(['GET'])
def get_classes(request):
    classes = Class.objects.all()
    serializer = ClassSerializer(classes, many=True)
    data = []
    for class_obj in classes:
        data.append({
            'class_id': class_obj.class_id,
            'name': class_obj.name,
            'section': class_obj.section,
            'year': class_obj.year,
            'admin': class_obj.admin,
        })
    return Response(serializer.data)

@api_view(['GET'])
def get_class_by_id(request, class_id):
    try:
        class_obj = Class.objects.get(pk=class_id)
        serializer = ClassSerializer(class_obj)
        return Response(serializer.data)
    except Class.DoesNotExist:
        return Response({'error': 'Class not found'}, status=404)
    
@api_view(['GET'])
def get_student_dashboard(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
        #to-do data here should return the dashboard's required data
        data ={
            'student_dash':'data'
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
