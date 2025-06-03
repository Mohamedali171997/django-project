# backend/fundo/settings.py
from dotenv import load_dotenv
from pathlib import Path
import os

import datetime
from datetime import timedelta
# from corsheaders.defaults import default_headers # Not needed if you define CORS_ALLOW_HEADERS explicitly
load_dotenv() # Cette ligne doit être appelée très tôt

# Récupérer la clé API de Gemini à partir de l'environnement
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Cette vérification est utile pour le débogage. Vous pouvez la laisser ou la retirer une fois que c'est fonctionnel.
if not GEMINI_API_KEY:
    raise Exception("GEMINI_API_KEY non trouvée. Assurez-vous que votre fichier .env est configuré correctement et que python-dotenv est installé.")

'''
GRAPHENE = {
    'SCHEMA': 'core.schema.schema' # Indique à Graphene où trouver votre schéma principal
}
'''


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'i(u54k@nwz9j1gn@5b(v%5^@$0-#$ssd^m$@l&l*=i5r2$dy@g'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'graphene_django',
    'corsheaders', # Keep corsheaders here
    'core', # Your app
    'rest_framework_simplejwt',
    'graphql_jwt',
]

MIDDLEWARE = [
    # CORS middleware MUST be placed as high as possible, usually first or second after SecurityMiddleware.
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware', # Only one instance of CommonMiddleware
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'graphql_jwt.middleware.JSONWebTokenMiddleware',
]

ROOT_URLCONF = 'fundo.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fundo.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    # Consolidated DEFAULT_AUTHENTICATION_CLASSES
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # You might want to add default permission classes here later, e.g.:
    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    # ]
}

GRAPHENE = {
    "SCHEMA": "core.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
    ],
}



# --- AJOUTEZ LA CONFIGURATION SIMPLE_JWT et GRAPHQL_JWT ICI ---
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60), # Ajustez selon vos besoins
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1), # Ajustez selon vos besoins
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY, # Utilisez votre SECRET_KEY ici
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}


GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=60), # Cohérent avec ACCESS_TOKEN_LIFETIME si c'est pour l'accès
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    'JWT_ALLOW_ANY_CLASSES': [
        'graphql_jwt.refresh_token.apps.RefreshTokenConfig',
    ],
    # 'JWT_SECRET_KEY': SECRET_KEY, # Non nécessaire si SIMPLE_JWT.SIGNING_KEY est défini
    'JWT_USER_MODEL': 'auth.User', # Spécifie le modèle User à utiliser (django.contrib.auth.models.User par défaut)
}




# MEDIA Files Settings
import os # Ensure this import is at the top of the file if not already

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # Using os.path.join is generally more robust

# CORS Settings - Choose one or the other for origins
# For development, allowing all origins is often simpler:
CORS_ALLOW_ALL_ORIGINS = True # Set to True for development.

# OR, if you prefer to be explicit (and safer, even in dev):
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000", # Good to include both localhost and 127.0.0.1
# ]

CORS_ALLOW_CREDENTIALS = True # Required if your frontend sends cookies or Authorization headers

# CORS_ALLOW_HEADERS - Your current list is good for file uploads
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization", # Crucial for JWT tokens
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken", # Important for CSRF protection with forms
    "x-requested-with",
]


CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]



#CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000",
                        "http://127.0.0.1:3000",]


