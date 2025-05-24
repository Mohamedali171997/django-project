from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Project(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='project_images/')
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
def __str__(self):
        return self.title