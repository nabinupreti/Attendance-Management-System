from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.getData, name="getdata"),
    path('login/', include("api.login.urls")),
    path('students/', views.get_students, name="get_students"),
    path('students/<int:student_id>/', views.get_student_by_id, name="get_student_by_id"),
    path('classes/', views.get_classes, name="get_classes"),
    path('classes/<int:class_id>/', views.get_class_by_id, name="get_class_by_id"),
    path('student_dashboard/<int:student_id>/', views.get_student_dashboard, name="get_student_dashboard"),
]