from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        """
        Creates and saves a User with the given email, date of birth and password.
        """
        if not username:
            raise ValueError('Users must have a username')
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        self.save(user)
        return user

    def create_superuser(self, username, email, password):
        """
        Creates and saves a superuser with the given email, date of birth and password.
        """
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        self.save(user)
        return user


class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        # Create auth token on user creation (optional, can be created separately)
        if not self.pk:
            Token.objects.create(user=self)


class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Class(models.Model):
    class_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=10)
    semester = models.CharField(max_length=10)
    year = models.IntegerField()
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.section}"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=50, blank=False, null=False)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=False, null=False)
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE)
    student_img = models.ImageField(upload_to='student_images')

    def __str__(self):
        return f"{self.first_name} {self.middle_name} {self.last_name}"


class Attendance(models.Model):
    PRESENT = 'Present'
    ABSENT = 'Absent'
    LATE = 'Late'
    STATUS_CHOICES = [
        (PRESENT, 'Present'),
        (ABSENT, 'Absent'),
        (LATE, 'Late'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PRESENT)
    date_time = models.DateTimeField(default=timezone.now)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student} - {self.get_status_display()} on {self.date_time.strftime('%Y-%m-%d %H:%M:%S')}"



#TO_DO DATABASE MODEL(1) BANAU ANI TESMA USER AUTH (-----) HYA CHAINE ARU
class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255, unique=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

#todo.............
#ARKO TOKEN KO HATAU SETTINGS SETUP(2) GARNE SIDE MA COMMENT
#SERIALIZER RA VIEWSET (3) BANAU 
#RUN CHAI NAGARA_______ LINKED IN MODEL M MEDIUM KO HERA ANI FRONTEND KO MA HERCHUq