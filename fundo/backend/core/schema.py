# backend/core/schema.py

import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required
from graphql import GraphQLError

from .models import Project, Category, UserProfile, Comment, Donation
from django.contrib.auth import get_user_model

# --- Object Types ---
# These define how your Django models are exposed in GraphQL

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileType(DjangoObjectType):
    user = graphene.Field(UserType)
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'bio', 'profile_picture', 'contact_info')

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ('id', 'name',)

class CommentType(DjangoObjectType):
    project = graphene.Field(lambda: ProjectType) # Use lambda for potential circular dependency
    commenter = graphene.Field(UserType)
    class Meta:
        model = Comment
        fields = ('id', 'project', 'commenter', 'content', 'created_at')

class DonationType(DjangoObjectType):
    project = graphene.Field(lambda: ProjectType) # Use lambda for potential circular dependency
    donor = graphene.Field(UserType)
    class Meta:
        model = Donation
        fields = ('id', 'project', 'donor', 'amount', 'donated_at')


class ProjectType(DjangoObjectType):
    owner = graphene.Field(UserType)
    category = graphene.Field(CategoryType)
    comments = graphene.List(CommentType)
    donations = graphene.List(DonationType) # Still expose donations from a project
    percentage_funded = graphene.Float()

    class Meta:
        model = Project
        fields = (
            'id', 'owner', 'title', 'description', 'goal_amount',
            'current_amount', 'percentage_funded', 'start_date', 'end_date', 'image',
            'is_active', 'created_at', 'updated_at', 'category', 'comments', 'donations'
        )

    def resolve_comments(self, info):
        return self.comments.all()

    def resolve_donations(self, info):
        return self.donations.all()


# --- Queries ---
# This defines what data can be fetched

class Query(graphene.ObjectType):
    # Project-related queries (keeping them as they are useful)
    all_projects = graphene.List(ProjectType)
    project_by_id = graphene.Field(ProjectType, id=graphene.Int())
    project_by_title = graphene.List(ProjectType, title=graphene.String())

    # User and Profile queries
    all_user_profiles = graphene.List(UserProfileType)
    user_profile_by_id = graphene.Field(UserProfileType, id=graphene.Int())
    me = graphene.Field(UserType)
    my_profile = graphene.Field(UserProfileType)

    # Category queries
    all_categories = graphene.List(CategoryType)

    # Donation-related queries (new or enhanced)
    all_donations = graphene.List(DonationType)
    donation_by_id = graphene.Field(DonationType, id=graphene.Int())
    # Query donations for a specific project
    donations_for_project = graphene.List(DonationType, projectId=graphene.Int())
    # Query donations made by a specific user (requires authentication for 'me')
    my_donations = graphene.List(DonationType)


    # --- Resolvers for the queries ---
    def resolve_all_projects(self, info, **kwargs):
        return Project.objects.filter(is_active=True)

    def resolve_project_by_id(self, info, id):
        try:
            return Project.objects.get(pk=id)
        except Project.DoesNotExist:
            return None

    def resolve_project_by_title(self, info, title):
        return Project.objects.filter(title__icontains=title)

    def resolve_all_user_profiles(self, info, **kwargs):
        return UserProfile.objects.all()

    def resolve_user_profile_by_id(self, info, id):
        try:
            return UserProfile.objects.get(pk=id)
        except UserProfile.DoesNotExist:
            return None

    @login_required
    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Not logged in!') # Use GraphQLError for GraphQL errors
        return user

    @login_required
    def resolve_my_profile(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Not logged in!')
        try:
            return user.userprofile
        except UserProfile.DoesNotExist:
            return None

    def resolve_all_categories(self, info, **kwargs):
        return Category.objects.all()

    def resolve_all_donations(self, info, **kwargs):
        return Donation.objects.all()

    def resolve_donation_by_id(self, info, id):
        try:
            return Donation.objects.get(pk=id)
        except Donation.DoesNotExist:
            return None

    def resolve_donations_for_project(self, info, projectId):
        try:
            project = Project.objects.get(pk=projectId)
            return project.donations.all()
        except Project.DoesNotExist:
            return [] # Return empty list if project not found

    @login_required
    def resolve_my_donations(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Authentication required to view your donations.')
        return Donation.objects.filter(donor=user)


# --- Mutations ---
# This defines what data can be modified or created

class CreateDonation(graphene.Mutation):
    class Arguments:
        projectId = graphene.Int(required=True)
        amount = graphene.Decimal(required=True)

    donation = graphene.Field(DonationType)

    @login_required # Only authenticated users can make donations
    def mutate(self, info, projectId, amount):
        donor = info.context.user
        if donor.is_anonymous:
            raise GraphQLError('Authentication required to make a donation.')

        if amount <= 0:
            raise GraphQLError("Donation amount must be positive.")

        try:
            project = Project.objects.get(pk=projectId)
        except Project.DoesNotExist:
            raise GraphQLError('Project not found.')

        # Ensure project is active and not ended
        if not project.is_active or project.end_date < graphene.Date(graphene.Date.today()):
            raise GraphQLError("Cannot donate to an inactive or ended project.")

        donation = Donation(
            donor=donor,
            project=project,
            amount=amount
        )
        donation.save() # The save method in models.py updates project.current_amount
        return CreateDonation(donation=donation)

class Mutation(graphene.ObjectType):
    create_donation = CreateDonation.Field()
    # You can add other mutations here (e.g., UpdateDonation if needed)

# --- Schema Definition ---
schema = graphene.Schema(query=Query, mutation=Mutation)