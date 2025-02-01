from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from api.models import User, Role, Admin, Class, Student, Attendance

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

# Role Serializer
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

# Admin Serializer
class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = RoleSerializer()

    class Meta:
        model = Admin
        fields = ['user', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        role_data = validated_data.pop('role')
        user = User.objects.create(**user_data)
        role, created = Role.objects.get_or_create(name=role_data['name'])
        admin = Admin.objects.create(user=user, role=role, **validated_data)
        return admin

# Class Serializer

class ClassSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['class_id', 'name', 'section', 'semester', 'year', 'admin']

    def get_admin(self, obj):
        return f"{obj.admin.first_name} {obj.admin.last_name}"

# Student Serializer
class StudentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    student_class = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['user', 'first_name', 'middle_name', 'last_name', 'student_class', 'student_img']

    def get_user(self, obj):
        """Format user object with id, username, and name."""
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "name": obj.user.name
        }

    def get_student_class(self, obj):
        """Return only the reference to the class instead of nesting the object."""
        return f"classes[{obj.student_class.class_id - 1}]"  # Assuming class_id starts from 1
# Attendance Serializer
class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = Attendance
        fields = ['id', 'status', 'date_time', 'student']

    def validate_status(self, value):
        if value not in [Attendance.PRESENT, Attendance.ABSENT, Attendance.LATE]:
            raise serializers.ValidationError("Invalid status value.")
        return value