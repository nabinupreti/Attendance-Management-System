from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.getData, name="getdata"),
    path('login/', include("api.login.urls")),
    path('csrf/', include("api.csrf.urls")),
    path('classes/', include("api.classes.urls")),
    path('students/', include("api.students.urls")),
]
