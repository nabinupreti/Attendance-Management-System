from django.contrib import admin
from django.urls import path, include
from .views import RegisterView, LoginView, UserView, LogoutView, StudentDashboardView, VerifyStudentIdentityView

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),
    path('student_dashboard/<int:user_id>/', StudentDashboardView.as_view(), name='student_dashboard'),
    path('verify_student_identity/', VerifyStudentIdentityView.as_view(), name='verify_student_identity'),

]