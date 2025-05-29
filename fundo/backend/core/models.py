from django.db import models
from django.contrib.auth.models import User
# Create your models here.

'''class Project(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='project_images/')
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
def __str__(self):
        return self.title
        '''
        # backend/core/models.py

from django.db import models
import datetime
from django.conf import settings # To link to the User model

class Project(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    image = models.ImageField(upload_to='project_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta: # <--- ADD THIS BLOCK
        ordering = ['-created_at'] # Order by creation date, newest first

    def __str__(self):
        return self.title

    @property
    def percentage_funded(self):
        if self.goal_amount > 0:
            return (self.current_amount / self.goal_amount) * 100
        return 0

    @property
    def is_active(self):
        # Without end_date and status, this is a simpler active definition
        return self.current_amount < self.goal_amount # Active until fully funded




# backend/core/models.py (add these lines at the end of the file)

# User Profile image upload path function
def user_profile_image_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid4().hex}.{ext}"
    return os.path.join('profile_images/', filename)

# UserProfile Model
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to=user_profile_image_upload_to, blank=True, null=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

# Signal to automatically create/update UserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

@receiver(post_save, sender=get_user_model())
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    # Ensure profile is saved if updated independently (e.g., from admin)
    # This also handles cases where user was created before signal was active
    if not hasattr(instance, 'profile'):
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories" # Correct plural in admin

    def __str__(self):
        return self.name

# Donation Model
class Donation(models.Model):
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='donations')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='donations')

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-donated_at']

    def __str__(self):
        return f"${self.amount} donated to {self.project.title} by {self.donor.username if self.donor else 'Anonymous'}"

    # Override save method to update project's current_amount
    def save(self, *args, **kwargs):
        is_new = self._state.adding # Check if this is a new object being created
        super().save(*args, **kwargs)
        if is_new: # Only update project amount when a new donation is created
            self.project.current_amount += self.amount
            self.project.save()


# Comment Model
class Comment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.commenter.username if self.commenter else 'Anonymous'} on {self.project.title}"