from django.urls import path
from .views import CsrfView

urlpatterns = [
    path('', CsrfView.as_view(), name='csrf_view'),
]