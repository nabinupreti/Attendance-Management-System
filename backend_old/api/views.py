from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import Student
from .models import Class


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
        data.append({
            'student_id': student.student_id,
            'name': student.name,
            'email': student.email,
            # Add other fields as needed
        })
    return Response(data)

@api_view(['GET'])
def get_student_by_id(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
        data = {
            'student_id': student.student_id,
            'name': student.name,
            'email': student.email,
            # Add other fields as needed
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    
@api_view(['GET'])
def get_classes(request):
    classes = Class.objects.all()
    data = []
    for class_obj in classes:
        data.append({
            'class_id': class_obj.class_id,
            'name': class_obj.name,
            # Add other fields as needed
        })
    return Response(data)

@api_view(['GET'])
def get_class_by_id(request, class_id):
    try:
        class_obj = Class.objects.get(pk=class_id)
        data = {
            'class_id': class_obj.class_id,
            'name': class_obj.name,
            # Add other fields as needed
        }
        return Response(data)
    except Class.DoesNotExist:
        return Response({'error': 'Class not found'}, status=404)
    
@api_view(['GET'])
def get_student_dashboard(request, student_id):
    try:
        student = Student.objects.get(pk=student_id)
        data = {
            'student_id': student.student_id,
            'name': student.name,
            'email': student.email,
            'classes': [class_obj.name for class_obj in student.classes.all()],
            'assignments': [
                {
                    'assignment_id': assignment.assignment_id,
                    'name': assignment.name,
                    'due_date': assignment.due_date
                } for assignment in student.assignments.all()
            ],
            'grades': [
                {
                    'grade_id': grade.grade_id,
                    'assignment_name': grade.assignment.name,
                    'grade': grade.grade
                } for grade in student.grades.all()
            ]
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
