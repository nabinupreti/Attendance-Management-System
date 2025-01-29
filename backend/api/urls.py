from django.contrib import admin
from django.urls import path, include
from .views import RegisterView, LoginView, UserView, LogoutView, StudentDashboardView

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"),
    path('student_dashboard/<int:user_id>/', StudentDashboardView.as_view(), name='student_dashboard'),

    # path("", views.getData, name="getdata"),
    # path('login/', include("api.login.urls")),
    # path('students/', views.get_students, name="get_students"),
    # path('students/<int:student_id>/', views.get_student_by_id, name="get_student_by_id"),
    # path('classes/', views.get_classes, name="get_classes"),
    # path('classes/<int:class_id>/', views.get_class_by_id, name="get_class_by_id"),
]