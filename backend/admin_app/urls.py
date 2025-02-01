from django.contrib import admin
from django.urls import path, include
from .views import RegisterView, LoginView, UserView, LogoutView, ClassListView, ClassDetailView, ClassCreateView, ClassUpdateView, ClassDeleteView, StudentListView, StudentDetailView, StudentCreateView, StudentUpdateView, StudentDeleteView, AttendanceListView, AttendanceDetailView, AttendanceCreateView, AttendanceUpdateView, AttendanceBulkUpdateView


urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),
    # path('student_dashboard/<int:user_id>/', StudentDashboardView.as_view(), name='student_dashboard'),


    # Classes
    path("classes", ClassListView.as_view(), name="class_list"),
    path("classes/<int:class_id>/", ClassDetailView.as_view(), name="class_detail"),
    path("classes/add", ClassCreateView.as_view(), name="add_class"),
    path("classes/<int:class_id>/update", ClassUpdateView.as_view(), name="update_class"),
    path("classes/<int:class_id>/delete", ClassDeleteView.as_view(), name="delete_class"),

    # Students
    path("students", StudentListView.as_view(), name="student_list"),
    path("students/<int:student_id>/", StudentDetailView.as_view(), name="student_detail"),
    path("students/add", StudentCreateView.as_view(), name="add_student"),
    path("students/<int:student_id>/update", StudentUpdateView.as_view(), name="update_student"),
    path("students/<int:student_id>/delete", StudentDeleteView.as_view(), name="delete_student"),

    # Attendance
    path("attendance", AttendanceListView.as_view(), name="attendance_list"),
    path("attendance/<int:attendance_id>/", AttendanceDetailView.as_view(), name="attendance_detail"),
    path("attendance/add", AttendanceCreateView.as_view(), name="add_attendance"),
    path("attendance/<int:attendance_id>/update", AttendanceUpdateView.as_view(), name="update_attendance"),
    path("attendance/bulk-update", AttendanceBulkUpdateView.as_view(), name="bulk_update_attendance"),
]