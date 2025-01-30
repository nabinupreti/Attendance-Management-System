from rest_framework import serializers
from .models import AdminUser
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'name', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print("I am inside Admin user serializer",validated_data)
        password = validated_data.pop('password', None)
        user = AdminUser.objects.create(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user