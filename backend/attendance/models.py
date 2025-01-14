from django.db import models
from django.utils import timezone

class Admin(models.Model):
    admin_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Class(models.Model):
    class_id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=100)
    section = models.CharField(max_length=10)
    year = models.IntegerField()
    role = models.CharField(max_length=50)
    admin_id = models.ForeignKey(Admin, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.class_name} - {self.section}"

class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    year = models.IntegerField()
    section = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Attendance(models.Model):
    status = models.CharField(max_length=10, default='Present')
    date_time = models.DateTimeField(default=timezone.now)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student} - {self.status} on {self.date_time}"


"""
sqlite3 db.sqlite3

.tables

.schema attendance_admin

"""