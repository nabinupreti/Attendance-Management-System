from django.urls import path
from .views import SimpleJsonView

urlpatterns = [
    path('', SimpleJsonView.as_view(), name='index'),
]
