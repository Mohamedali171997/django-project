# backend/core/schema.py
'''
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




'''



# backend/core/schema.py

import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.db.models import Sum

from .models import Project, UserProfile, Category, Donation, Comment

# Pour l'intégration Gemini
import google.generativeai as genai
from django.conf import settings
import requests # Pour faire une requête interne à l'API REST de l'assistant (si elle reste séparée)


User = get_user_model()

# Configure Gemini avec votre clé API
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
except ValueError as e:
    print(f"Erreur de configuration Gemini: {e}. Assurez-vous que GEMINI_API_KEY est défini.")


# --- 1. Types GraphQL pour vos modèles Fundo ---

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ('phone', 'country', 'bio', 'profile_picture')

class UserType(DjangoObjectType):
    profile = graphene.Field(UserProfileType)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

    def resolve_profile(self, info):
        try:
            return self.userprofile
        except UserProfile.DoesNotExist:
            return None

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = '__all__'

class ProjectType(DjangoObjectType):
    percentage_funded = graphene.Decimal()
    owner_username = graphene.String() # Pour exposer le nom d'utilisateur du propriétaire

    class Meta:
        model = Project
        fields = (
            'id', 'owner', 'title', 'description', 'goal_amount',
            'current_amount', 'start_date', 'end_date', 'image',
            'created_at', 'updated_at'
        )

    def resolve_percentage_funded(self, info):
        if self.goal_amount > 0:
            return (self.current_amount / self.goal_amount) * 100
        return 0.00

    def resolve_owner_username(self, info):
        return self.owner.username if self.owner else None


class DonationType(DjangoObjectType):
    donor_username = graphene.String() # Pour exposer le nom d'utilisateur du donateur

    class Meta:
        model = Donation
        fields = ('id', 'donor', 'project', 'amount', 'donated_at')

    def resolve_donor_username(self, info):
        return self.donor.username if self.donor else None


class CommentType(DjangoObjectType):
    commenter_username = graphene.String() # Pour exposer le nom d'utilisateur du commentateur

    class Meta:
        model = Comment
        fields = ('id', 'project', 'commenter', 'content', 'created_at')

    def resolve_commenter_username(self, info):
        return self.commenter.username if self.commenter else None


# --- 2. Requêtes (Queries) ---
# Ce sont les opérations de lecture de données

class Query(graphene.ObjectType):
    # Requêtes pour les Projets
    all_projects = graphene.List(ProjectType)
    project_by_id = graphene.Field(ProjectType, id=graphene.Int(required=True))
    my_projects = graphene.List(ProjectType) # Projets de l'utilisateur authentifié

    # Requêtes pour les Catégories
    all_categories = graphene.List(CategoryType)
    category_by_id = graphene.Field(CategoryType, id=graphene.Int(required=True))

    # Requêtes pour les Utilisateurs et Profils
    all_users = graphene.List(UserType)
    user_by_id = graphene.Field(UserType, id=graphene.Int(required=True))
    my_profile = graphene.Field(UserProfileType)

    # Requêtes pour les Donations
    all_donations = graphene.List(DonationType)
    donations_by_project = graphene.List(DonationType, projectId=graphene.Int(required=True))
    my_donations = graphene.List(DonationType)


    # Résolveurs (fonctions qui récupèrent les données)

    def resolve_all_projects(self, info, **kwargs):
        return Project.objects.all().order_by('-created_at')

    def resolve_project_by_id(self, info, id):
        try:
            return Project.objects.get(pk=id)
        except Project.DoesNotExist:
            return None

    def resolve_my_projects(self, info, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Authentification requise pour voir vos projets.")
        return Project.objects.filter(owner=info.context.user).order_by('-created_at')

    def resolve_all_categories(self, info, **kwargs):
        return Category.objects.all().order_by('name')

    def resolve_category_by_id(self, info, id):
        try:
            return Category.objects.get(pk=id)
        except Category.DoesNotExist:
            return None

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_user_by_id(self, info, id):
        try:
            return User.objects.get(pk=id)
        except User.DoesNotExist:
            return None

    def resolve_my_profile(self, info, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Authentification requise pour voir votre profil.")
        try:
            return UserProfile.objects.get(user=info.context.user)
        except UserProfile.DoesNotExist:
            return None

    def resolve_all_donations(self, info, **kwargs):
        return Donation.objects.all().order_by('-donated_at')

    def resolve_donations_by_project(self, info, projectId):
        return Donation.objects.filter(project__id=projectId).order_by('-donated_at')

    def resolve_my_donations(self, info, **kwargs):
        if not info.context.user.is_authenticated:
            raise Exception("Authentification requise pour voir vos donations.")
        return Donation.objects.filter(donor=info.context.user).order_by('-donated_at')


# --- 3. Mutations ---
# Ce sont les opérations d'écriture de données et les actions

# 3.1. Mutation pour l'enregistrement de l'utilisateur (simplifié)
class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, username, email, password):
        user = User.objects.create_user(username=username, email=email, password=password)
        # Créer un profil utilisateur par défaut si nécessaire
        # UserProfile.objects.create(user=user)
        return CreateUser(user=user)

# 3.2. Mutation pour créer un Projet
class CreateProject(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        goal_amount = graphene.Decimal(required=True)
        # Ajouter d'autres champs nécessaires pour la création

    project = graphene.Field(ProjectType)

    @classmethod
    def mutate(cls, root, info, title, description, goal_amount):
        if not info.context.user.is_authenticated:
            raise Exception("Authentification requise pour créer un projet.")
        project = Project(
            owner=info.context.user,
            title=title,
            description=description,
            goal_amount=goal_amount
            # Initialiser d'autres champs si nécessaire
        )
        project.save()
        return CreateProject(project=project)

# 3.3. Mutation pour financer un Projet
class FundProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.Int(required=True)
        amount = graphene.Decimal(required=True)

    project = graphene.Field(ProjectType)
    donation = graphene.Field(DonationType) # Peut retourner l'objet donation créé

    @classmethod
    def mutate(cls, root, info, project_id, amount):
        if not info.context.user.is_authenticated:
            raise Exception("Authentification requise pour faire un don.")
        if amount <= 0:
            raise Exception("Le montant du don doit être positif.")

        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            raise Exception("Projet introuvable.")

        project.current_amount += amount
        project.save()

        donation = Donation.objects.create(
            donor=info.context.user,
            project=project,
            amount=amount
        )
        return FundProject(project=project, donation=donation)

# 3.4. Mutation pour interagir avec l'Assistant Gemini
class AskGeminiAssistant(graphene.Mutation):
    class Arguments:
        message = graphene.String(required=True)

    response_text = graphene.String() # Nom du champ de retour

    @classmethod
    def mutate(cls, root, info, message):
        try:
            # Note: Nous appelons directement l'API Gemini ici
            # Si la logique Gemini était dans une fonction utilitaire dans core/views.py,
            # vous pourriez l'importer et l'appeler.
            # Sinon, vous faites l'appel direct comme ceci:
            model = genai.GenerativeModel('gemini-2.0-flash')
            gemini_response = model.generate_content(message)

            if gemini_response and hasattr(gemini_response, 'text') and gemini_response.text:
                assistant_reply = gemini_response.text
            else:
                assistant_reply = "Désolé, je n'ai pas pu générer de réponse pour le moment. Le contenu pourrait être sensible ou hors de ma portée."
                print(f"Gemini a renvoyé une réponse vide ou non textuelle pour : {message}")

            return AskGeminiAssistant(response_text=assistant_reply)

        except Exception as e:
            print(f"Erreur lors de l'appel à l'API Gemini : {e}")
            raise Exception(f"Une erreur est survenue avec l'assistant IA: {e}")


# Classe Mère des Mutations
class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_project = CreateProject.Field()
    fund_project = FundProject.Field()
    ask_gemini_assistant = AskGeminiAssistant.Field() # Ajoute la mutation pour l'assistant

    # Vous ajouterez ici d'autres mutations pour update_project, delete_project,
    # create_comment, update_user_profile, etc.


# --- 4. Schéma GraphQL Principal ---
schema = graphene.Schema(query=Query, mutation=Mutation)