from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    face_encoding = models.BinaryField()

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
