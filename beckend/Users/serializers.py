from rest_framework import serializers
from django.contrib.auth.models import User


class AdminUserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer used by the dashboard "User Management" page.
    It matches the fields the frontend sends:
      - first_name, last_name, email, is_active, is_superuser
    and auto-generates:
      - username (from email) and a default password.
    """

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'is_superuser']

    def create(self, validated_data):
        email = validated_data.get('email', '')
        base_username = (email.split('@')[0] or 'user').lower()

        # Ensure username is unique
        username = base_username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{i}"
            i += 1

        is_superuser = validated_data.get('is_superuser', False)

        user = User.objects.create_user(
            username=username,
            email=email,
            password='changeme123',  # default password for new users
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=validated_data.get('is_active', True),
            is_superuser=is_superuser,
            is_staff=is_superuser,
        )
        return user

    def update(self, instance, validated_data):
        # Allow updating basic profile + flags from the dashboard
        for attr in ['first_name', 'last_name', 'email', 'is_active', 'is_superuser']:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        # Keep staff flag in sync with superuser for simplicity
        instance.is_staff = instance.is_superuser
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """
    Public registration serializer (no is_staff / is_active flags from client).
    """
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user
