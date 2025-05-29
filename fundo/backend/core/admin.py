from django.contrib import admin

# Register your models here.
# backend/core/admin.py
from django.contrib import admin
from .models import Project # Import your Project model
from django.contrib.auth.admin import UserAdmin # If you want to customize User admin
from django.contrib.auth import get_user_model # To get the current active User model

from .models import UserProfile, Category, Project, Donation, Comment
# Register your models here.
admin.site.register(Project)



# Optional: Customize User Admin to show profile fields (recommended)
# This will allow you to see and edit UserProfile directly from the User admin page
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    # If you add fields to UserProfile, you can optionally display them here:
    # list_display = UserAdmin.list_display + ('phone', 'country',) # Example if phone/country were on User directly
    # fieldsets = UserAdmin.fieldsets + (
    #     ('Profile Information', {'fields': ('phone', 'country', 'bio', 'profile_picture')}),
    # )

# Re-register Django's default User model with your custom admin.
# Make sure this is present, it customizes how users are displayed in the admin.
admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), CustomUserAdmin)

# Register the rest of your new models
admin.site.register(Category)
#admin.site.register(Project) # Make sure your existing Project model is registered here
admin.site.register(Donation)
admin.site.register(Comment)
admin.site.register(UserProfile) # You can also register UserProfile directly if you want it editable standalone