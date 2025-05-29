'''from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
'''
'''from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
'''
from rest_framework import serializers
from .models import Project, UserProfile, Category, Donation, Comment # Make sure all these are imported
from django.contrib.auth import get_user_model

User = get_user_model()

# Project Serializer
class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    percentage_funded = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'owner', 'owner_username', 'title', 'description', 'goal_amount',
            'current_amount', 'percentage_funded', 'start_date', 'end_date', 'image',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'current_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the owner to the current authenticated user
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'country', 'bio', 'profile_picture']

# User Serializer (for exposing basic user info with profile or for registration)
# This combined your two UserSerializer definitions.
class UserSerializer(serializers.ModelSerializer):
    # This checks if the User model has a related profile (if using UserProfile)
    profile = UserProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False) # Make password optional for display

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'password']
        read_only_fields = ['username', 'email', 'first_name', 'last_name'] # Default for display

    def create(self, validated_data):
        # This part handles user registration
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# Donation Serializer
class DonationSerializer(serializers.ModelSerializer):
    donor_username = serializers.ReadOnlyField(source='donor.username')

    class Meta:
        model = Donation
        fields = ['id', 'donor', 'donor_username', 'project', 'amount', 'donated_at']
        read_only_fields = ['donor', 'donated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Donation amount must be positive.")
        return value

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    commenter_username = serializers.ReadOnlyField(source='commenter.username')

    class Meta:
        model = Comment
        fields = ['id', 'project', 'commenter', 'commenter_username', 'content', 'created_at']
        read_only_fields = ['commenter', 'created_at']