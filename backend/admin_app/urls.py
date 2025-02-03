from django.contrib import admin
from django.urls import path, include
from .views import (
    RegisterView, LoginView, UserView,LogoutView, 
    ClassListView, ClassCreateView, ClassUpdateView, ClassDeleteView,
    StudentListView, StudentCreateView,
    AttendanceListView, AttendanceUpdateView,
    AttendanceReportView, AttendanceExportView
)

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),
    # path('student_dashboard/<int:user_id>/', StudentDashboardView.as_view(), name='student_dashboard'),

    # Classes
    path('classes/', ClassListView.as_view(), name='class-list'),
    path('classes/', ClassCreateView.as_view(), name='class-create'),
    path('classes/<int:class_id>/', ClassUpdateView.as_view(), name='class-update'),
    path('classes/<int:class_id>/', ClassDeleteView.as_view(), name='class-delete'),

    # Students
    path('students/', StudentListView.as_view(), name='student-list'),
    path('students/', StudentCreateView.as_view(), name='student-create'),

    # Attendance
    path('attendance/', AttendanceListView.as_view(), name='attendance-list'),
    path('attendance/<int:attendance_id>/', AttendanceUpdateView.as_view(), name='attendance-update'),

    # Reports
    path('reports/attendance/', AttendanceReportView.as_view(), name='attendance-report'),
    path('reports/export/', AttendanceExportView.as_view(), name='attendance-export'),

]