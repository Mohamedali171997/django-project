'''from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
'''
from rest_framework import viewsets, status, permissions, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

from .models import Project, UserProfile, Category, Donation, Comment
from .serializers import (
    ProjectSerializer,
    UserProfileSerializer,
    CategorySerializer,
    DonationSerializer,
    CommentSerializer,
    UserSerializer # Using the combined UserSerializer
)

User = get_user_model()

# User Registration View
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer # Use the UserSerializer for creation
    permission_classes = [permissions.AllowAny]

# User Profile ViewSet
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='me')
    def get_my_profile(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put', 'patch'], url_path='me/update')
    def update_my_profile(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

# Category ViewSet (Read-Only)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Project ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        if 'my_projects' in self.request.query_params:
            if self.request.user.is_authenticated:
                return self.queryset.filter(owner=self.request.user)
            return self.queryset.none()
        return self.queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def fund(self, request, pk=None):
        project = self.get_object()
        amount = request.data.get('amount')

        if not amount or not isinstance(amount, (int, float)) or amount <= 0:
            return Response({'error': 'A valid positive amount is required.'}, status=status.HTTP_400_BAD_REQUEST)

        project.current_amount += float(amount)
        project.save()
        # You might want to create a Donation record here as well
        # Donation.objects.create(donor=request.user, project=project, amount=amount)

        serializer = self.get_serializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'fund']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in self.permission_classes]

# Donation ViewSet
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all().order_by('-donated_at')
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    def get_queryset(self):
        if 'my_donations' in self.request.query_params:
            if self.request.user.is_authenticated:
                return self.queryset.filter(donor=self.request.user)
            return self.queryset.none()
        return self.queryset

# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user)
































# backend/core/views.py
from rest_framework import viewsets, status, permissions, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

from .models import Project, UserProfile, Category, Donation, Comment
from .serializers import (
    ProjectSerializer,
    UserProfileSerializer,
    CategorySerializer,
    DonationSerializer,
    CommentSerializer,
    UserSerializer
)

User = get_user_model()

# ... (rest of your UserCreateView, UserProfileViewSet, CategoryViewSet, ProjectViewSet, DonationViewSet) ...

# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user)

    def get_queryset(self):
        queryset = self.queryset
        # Check if project_pk is in the URL kwargs (from the nested URL pattern)
        project_pk = self.kwargs.get('project_pk')
        if project_pk:
            queryset = queryset.filter(project__pk=project_pk)
        return queryset