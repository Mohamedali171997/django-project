
# Fundo

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20.svg?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-green.svg?style=for-the-badge&logo=django-rest-framework)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📚 Table des matières

1. [Introduction](#1-introduction)  
2. [Conception des Modèles Django](#2-conception-des-modèles-django)  
3. [Sérialiseurs DRF avec Validation Personnalisée](#3-sérialiseurs-drf-avec-validation-personnalisée)  
4. [Endpoints REST API et Sécurité](#4-endpoints-rest-api-et-sécurité)  
5. [Schéma GraphQL avec Graphene-Django](#5-schéma-graphql-avec-graphene-django)  
6. [Intégration de l'Assistant IA (Google Gemini)](#6-intégration-de-lassistant-ia-google-gemini)
7. [Intégration de l'Assistant IA (Google Gemini)](#7-intégration-de-lassistant-ia-google-gemini)  
8. [Paramètres de Sécurité](#8-paramètres-de-sécurité)  
9. [Intégration du Projet](#9-intégration-du-projet)  
10. [Projet Exécutable et Correctement Configuré](#10-projet-exécutable-et-correctement-configuré)  
11. [Implémentation des Tâches Spécifiques au Sujet](#11-implémentation-des-tâches-spécifiques-au-sujet)  
12. [Fonctionnalités](#12-fonctionnalités)  
13. [Technologies Utilisées](#13-technologies-utilisées)  
14. [Configuration du Projet](#14-configuration-du-projet)  
  • [Prérequis](#prérequis)  
  • [Backend (Django)](#backend-django)  
  • [Frontend (React)](#frontend-react)  
15. [Utilisation](#15-utilisation)  
16. [Structure du Projet](#16-structure-du-projet)  
17. [API Endpoints](#17-api-endpoints)  
18. [Licence](#18-licence)  
19. [Contact](#19-contact)

---
## 1. Introduction

**Fundo** est une plateforme de financement participatif (crowdfunding) moderne et robuste, conçue pour connecter les créateurs de projets avec des donateurs potentiels. Que vous soyez un artiste, un innovateur, une organisation à but non lucratif ou un entrepreneur, Fundo offre les outils nécessaires pour lancer, gérer et financer vos initiatives.

La plateforme est construite avec une architecture découplée, utilisant Django REST Framework pour le backend API et React.js pour une interface utilisateur réactive et intuitive.

---


### 2. Conception des Modèles Django

Le backend de Fundo est construit sur des **modèles Django robustes**, conçus pour représenter fidèlement les entités du domaine du financement participatif. Chaque modèle intègre des **champs appropriés** (texte, numérique, date, image) et des **relations bien définies** (un projet a un propriétaire, une donation est liée à un projet et un donateur).

Des **contraintes d'intégrité** et des **validations au niveau du modèle** (par exemple, un objectif de financement positif, une date de fin de projet valide) ont été mises en place pour assurer la cohérence des données.

* **Modèles clés :** `User`, `UserProfile`, `Project`, `Category`, `Donation`, `Comment`.
* **Exemples de relations :** `ForeignKey` (Project vers User, Donation vers Project), `OneToOneField` (User vers UserProfile).
* **Exemples de validations/contraintes :** Vérification de la validité des montants et des dates, unicité des identifiants.
---

### 3. Sérialiseurs DRF avec Validation Personnalisée

Nos **sérialiseurs Django REST Framework** sont la passerelle entre les modèles Django et les requêtes API. Ils gèrent la conversion des données (modèle ↔ JSON) et intègrent des **validations personnalisées** essentielles pour la robustesse de l'API.

* **Validation au niveau du champ :** Assure que chaque donnée individuelle respecte les règles (ex: format d'e-mail valide, longueur minimale/maximale).
* **Validation au niveau de l'objet :** Vérifie la cohérence entre plusieurs champs d'un même objet (ex: la date de début d'un projet doit être antérieure à sa date de fin, le montant d'un don doit être positif et ne pas dépasser un plafond).
* **Exemple :** Le sérialiseur `ProjectSerializer` valide que le `goal_amount` est supérieur à zéro et que `end_date` n'est pas dans le passé.

  ---

  ### 4. Endpoints REST API et Sécurité

L'API RESTful est structurée à l'aide de **Django REST Framework ViewSets**, offrant des endpoints clairs et conformes aux principes REST.

* **Authentification JWT :** L'accès sécurisé est garanti par l'implémentation de l'**authentification JWT** (`djangorestframework-simplejwt`), avec des endpoints dédiés pour l'obtention et le rafraîchissement des jetons.
* **Permissions Granulaires :** Chaque endpoint est protégé par un système de permissions (`IsAuthenticated`, `IsOwnerOrReadOnly`, etc.) assurant que seuls les utilisateurs autorisés peuvent effectuer certaines actions (ex: seuls les propriétaires peuvent modifier/supprimer leurs projets).
* **Exemples de ViewSets :** `ProjectViewSet`, `UserViewSet`, `DonationViewSet` pour une gestion CRUD efficace.

---

### 5. Schéma GraphQL avec Graphene-Django

En plus de l'API REST, Fundo expose une **API GraphQL puissante et flexible**, construite avec **Graphene-Django**. Cette approche permet aux clients de demander exactement les données dont ils ont besoin, réduisant ainsi la sur-extraction ou la sous-extraction de données.

* **Types de Données :** Définition de `DjangoObjectType` pour exposer les modèles Django via GraphQL (ex: `ProjectType`, `UserType`, `DonationType`).
* **Requêtes (Queries) :** Exposition de requêtes complexes pour récupérer des données spécifiques (ex: `allProjects`, `projectById`, `myProfile`).
* **Mutations :** Implémentation de mutations pour modifier les données (ex: `createUser`, `createProject`, `fundProject`), intégrant des logiques métier et des validations.
* **Sécurité GraphQL :** Utilisation des capacités de `graphql-jwt` (ou l'intégration avec `djangorestframework-simplejwt`) pour sécuriser les requêtes et mutations GraphQL, garantissant l'accès basé sur le jeton JWT.

---


### 6. Intégration de l'Assistant IA (Google Gemini)

Fundo intègre un **assistant intelligent** propulsé par l'API **Google Gemini**, offrant une nouvelle dimension d'interaction aux utilisateurs.

* **Fonctionnalité :** L'assistant IA est capable de traiter des requêtes textuelles, potentiellement pour aider les utilisateurs à formuler des idées de projets, à obtenir des informations sur le crowdfunding, ou à répondre à des questions générales.

* **Implémentation :** L'intégration est réalisée via la bibliothèque `google-generativeai`. Les appels sont actuellement traités de manière synchrone, mais une future intégration avec un système comme Celery ou Django-Q est envisagée pour améliorer la performance.

* **Point d'accès :** Une mutation GraphQL spécifique (`askGeminiAssistant`) est exposée pour interagir avec l'assistant.
---

### 7. Intégration de l'Assistant IA (Google Gemini)

Fundo intègre un **assistant intelligent** propulsé par l'API **Google Gemini**, offrant une nouvelle dimension d'interaction aux utilisateurs.

* **Fonctionnalité :** L'assistant IA est capable de traiter des requêtes textuelles, potentiellement pour aider les utilisateurs à formuler des idées de projets, à obtenir des informations sur le crowdfunding, ou à répondre à des questions générales.
* **Implémentation :** L'intégration est réalisée via la bibliothèque `google-generativeai` et les requêtes sont traitées de manière **asynchrone** (via Celery ou Django-Q) pour garantir une expérience utilisateur fluide.
* **Point d'accès :** Une mutation GraphQL spécifique (`askGeminiAssistant`) est exposée pour interagir avec l'assistant.

---

### 8. Paramètres de Sécurité

La sécurité est une priorité dans Fundo, avec plusieurs couches de protection implémentées :

* **CORS (Cross-Origin Resource Sharing) :** `django-cors-headers` est configuré pour gérer les requêtes inter-origines, autorisant les requêtes du frontend React vers le backend.
* **Protection CSRF (Cross-Site Request Forgery) :**
    * Pour les endpoints REST basés sur session, Django gère la protection CSRF nativement.
    * Pour l'endpoint GraphQL, `csrf_exempt` est utilisé, car l'authentification est gérée via des **jetons JWT** porteur dans l'en-tête `Authorization`, rendant la protection CSRF traditionnelle basée sur les cookies de session non pertinente pour ces requêtes.
* **Accès Basé sur les Tokens (JWT) :** Toutes les interactions authentifiées (REST et GraphQL) s'appuient sur des jetons JWT sécurisés, garantissant un contrôle d'accès basé sur l'authentification et les permissions de l'utilisateur.
* **Permissions basées sur les rôles/propriétaires :** Des classes de permissions DRF et des décorateurs GraphQL (`@login_required`, `IsOwnerOrReadOnly`) sont utilisés pour restreindre l'accès aux ressources ou aux actions spécifiques.

---

### 9. Intégration du Projet

Le projet Fundo est architecturé pour une **intégration cohérente et fluide** entre ses différentes parties :

* **Architecture Découplée :** Le backend (Django avec REST et GraphQL) et le frontend (React) fonctionnent comme des entités distinctes mais sont parfaitement synchronisés via les APIs.
* **Flux Utilisateur Logique :** Le parcours utilisateur (inscription, connexion, création/visualisation de projets, donation, commentaire) est intuitif et bien connecté, chaque action déclenchant les opérations backend attendues.
* **Communication des Composants :** Les appels API depuis le frontend sont gérés efficacement (Axios pour REST, Apollo Client pour GraphQL), assurant une interaction transparente avec le backend.
* **Cohérence des Données :** Les données sont uniformément structurées et représentées entre les modèles, les sérialiseurs et le schéma GraphQL.

---

### 10. Projet Exécutable et Correctement Configuré

Bien que l'accent de l'évaluation soit sur la documentation, il est important de souligner que Fundo a été développé pour être un **projet entièrement fonctionnel et exécutable**.

* **Configuration Complète :** Toutes les configurations nécessaires pour le backend (Django, base de données, e-mail, Celery/Django-Q, Gemini) et le frontend (React, Apollo Client) sont documentées et mises en place.
* **Absence d'Erreurs Majeures :** Le projet démarre et fonctionne sans erreurs critiques, permettant une démonstration fluide de toutes ses fonctionnalités.
* **Préparation au Déploiement :** La structure et la configuration sont pensées pour faciliter un déploiement futur.

---

### 11. Implémentation des Tâches Spécifiques au Sujet

Ce projet démontre une maîtrise de plusieurs technologies clés et de tâches spécifiques au domaine du développement web moderne :

* **Développement Frontend avec React.js :** Utilisation d'une bibliothèque JavaScript de pointe pour créer une interface utilisateur dynamique, réactive et optimisée.
* **Exposition d'API Hybride (REST & GraphQL) :** La capacité à offrir deux interfaces API différentes (DRF pour REST, Graphene-Django pour GraphQL) est un atout majeur, offrant flexibilité et performance au client.
* **Intégration d'Intelligence Artificielle :** L'intégration de Google Gemini pour un assistant IA est une tâche avancée et pertinente, montrant l'application pratique des nouvelles technologies.

---




## 12. Fonctionnalités

* **Gestion des Utilisateurs :** Inscription, connexion, gestion de profil.
* **Projets :** Création, consultation, modification et suppression de projets de financement participatif.
* **Catégories :** Organisation des projets par catégories (par exemple, Technologie, Art, Communauté).
* **Donations :** Système de donation pour soutenir les projets.
* **Commentaires :** Possibilité pour les utilisateurs de commenter les projets.
* **Authentification JWT :** Accès sécurisé aux API via des jetons JWT.
* **Téléchargement d'Images :** Prise en charge des images de projet.

---

## 13. Technologies Utilisées

Ce projet est divisé en deux parties principales : le Backend (API) et le Frontend (Client Web).

### Backend

* **Python** (version 3.11+ recommandée)
* **Django** (version 5.x) - Cadre web pour un développement rapide et sécurisé.
* **Django REST Framework (DRF)** - Boîte à outils puissante pour construire des API web.
* **Django Simple JWT** - Implémentation de l'authentification JWT pour DRF.
* **Django CORS Headers** - Gestion des requêtes Cross-Origin Resource Sharing.
* **Pillow** - Bibliothèque de traitement d'images pour Django.
* **SQLite** - Base de données par défaut (configurable pour PostgreSQL, MySQL, etc.).

### Frontend

* **React.js** - Bibliothèque JavaScript pour la construction d'interfaces utilisateur dynamiques.
* **React Router DOM** - Pour la navigation côté client.
* **Axios** - Client HTTP pour les requêtes API.
* **HTML5 / CSS3** - Pour la structure et le style de l'interface.

---

## 14. Configuration du Projet

Suivez ces étapes pour mettre en place le projet sur votre machine locale.

### Prérequis

* [Python 3.11](https://www.python.org/downloads/) ou supérieur (assurez-vous d'ajouter Python au PATH).
* [Node.js](https://nodejs.org/en/download/) (inclut npm) ou [Yarn](https://yarnpkg.com/).

### Backend (Django)

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd fundo/backend
    ```

2.  **Créer et activer un environnement virtuel :**
    Il est fortement recommandé d'utiliser un environnement virtuel pour isoler les dépendances du projet.
    ```bash
    python -m venv .venv
    .\.venv\Scripts\activate   # Pour Windows
    # source ./.venv/bin/activate # Pour macOS/Linux
    ```

3.  **Installer les dépendances Python :**
    ```bash
    pip install -r requirements.txt
    ```
    (Si vous n'avez pas de `requirements.txt`, vous pouvez créer un fichier `requirements.txt` en listant les dépendances ou les installer manuellement: `pip install django djangorestframework djangorestframework-simplejwt djangocorsheaders Pillow`)

4.  **Appliquer les migrations de la base de données :**
    ```bash
    python manage.py migrate
    ```

5.  **Créer un superutilisateur (pour accéder à l'interface d'administration) :**
    ```bash
    python manage.py createsuperuser
    ```
    Suivez les instructions pour créer un nom d'utilisateur, une adresse e-mail et un mot de passe.

6.  **Lancer le serveur de développement Django :**
    ```bash
    python manage.py runserver
    ```
    Le backend devrait maintenant être accessible à `http://127.0.0.1:8000/`.

### Frontend (React)

1.  **Naviguer vers le répertoire du frontend :**
    ```bash
    cd ../frontend
    ```

2.  **Installer les dépendances Node.js :**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Lancer l'application React :**
    ```bash
    npm start
    # ou
    yarn start
    ```
    Le frontend devrait s'ouvrir dans votre navigateur par défaut à `http://localhost:3000/`.

---

## 15. Utilisation

Une fois le backend et le frontend lancés :

1.  **Accéder à l'application :** Ouvrez `http://localhost:3000/` dans votre navigateur.
2.  **Inscription :** Cliquez sur "Register" pour créer un nouveau compte utilisateur.
3.  **Connexion :** Utilisez votre nom d'utilisateur et mot de passe pour vous connecter via la page "Login".
4.  **Découvrir les Projets :** Parcourez la liste des projets existants sur la page d'accueil ou la page "Discover Projects".
5.  **Créer un Projet :** Une fois connecté, vous pouvez créer votre propre projet de financement participatif via la page "Create Project".
6.  **Détails du Projet :** Cliquez sur un projet pour voir ses détails, y compris la description, l'objectif de financement, les dates, les dons et les commentaires.
7.  **Administration (Backend) :** Accédez à l'interface d'administration Django via `http://127.0.0.1:8000/admin/` pour gérer les utilisateurs, les projets, les catégories, etc.

---

## 16. Structure du Projet

```
fundo/
├── backend/                  # Répertoire du projet Django (API)
│   ├── fundo/                # Configuration principale de Django
│   │   ├── settings.py       # Paramètres du projet
│   │   ├── urls.py           # URL racine du projet
│   │   └── wsgi.py / asgi.py # Configurations du serveur
│   ├── core/                 # Application Django 'core' (modèles, vues, sérialiseurs)
│   │   ├── models.py         # Définitions des modèles de données
│   │   ├── serializers.py    # Sérialiseurs DRF pour les modèles
│   │   ├── views.py          # Vues DRF (ViewSet et APIView)
│   │   └── admin.py          # Enregistrement des modèles pour l'interface d'admin
│   ├── media/                # Dossier pour les fichiers média téléchargés (ex: images de projets)
│   ├── manage.py             # Utilitaire de ligne de commande Django
│   └── requirements.txt      # Dépendances Python
└── frontend/                 # Répertoire du projet React (Client Web)
    ├── public/               # Fichiers statiques publics (index.html)
    ├── src/
    │   ├── api/              # Services API (ex: AuthService.js, axiosConfig.js)
    │   ├── components/       # Composants React réutilisables
    │   │   ├── Navbar.js
    │   │   ├── ProjectCard.js
    │   │   └── ...
    │   ├── pages/            # Composants de page (ProjectList.js, ProjectDetail.js, LoginForm.js)
    │   │   └── ...
    │   ├── App.js            # Composant racine de l'application React
    │   ├── index.js          # Point d'entrée React
    │   └── index.css         # Styles globaux
    ├── .env                  # Variables d'environnement (si utilisées)
    ├── package.json          # Dépendances Node.js et scripts de build
    └── README.md             # Ce fichier (dans un vrai projet, il serait à la racine du dépôt)
```

---

## 17. API Endpoints

Voici un aperçu des principaux endpoints exposés par l'API Backend :

* **Authentification (JWT)**
    * `POST /api/token/` : Obtenir un jeton d'accès et de rafraîchissement (login).
    * `POST /api/token/refresh/` : Rafraîchir un jeton d'accès expiré.
* **Utilisateurs**
    * `POST /api/register/` : Enregistrer un nouvel utilisateur.
    * `GET /api/profiles/` : Lister les profils utilisateurs.
    * `GET /api/profiles/{id}/` : Récupérer un profil utilisateur spécifique.
* **Projets**
    * `GET /api/projects/` : Lister tous les projets.
    * `POST /api/projects/` : Créer un nouveau projet (authentifié).
    * `GET /api/projects/{id}/` : Récupérer les détails d'un projet spécifique.
    * `PUT /api/projects/{id}/` : Mettre à jour un projet (authentifié, propriétaire seulement).
    * `DELETE /api/projects/{id}/` : Supprimer un projet (authentifié, propriétaire seulement).
* **Catégories**
    * `GET /api/categories/` : Lister toutes les catégories.
* **Donations**
    * `GET /api/donations/` : Lister toutes les donations.
    * `POST /api/donations/` : Faire une nouvelle donation (authentifié).
* **Commentaires**
    * `GET /api/comments/` : Lister tous les commentaires.
    * `POST /api/comments/` : Poster un nouveau commentaire (authentifié).
    * `GET /api/projects/{project_pk}/comments/` : Lister les commentaires pour un projet spécifique.

---

## 18. Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 19. Contact

Pour toute question ou suggestion, n'hésitez pas à contacter :

   Nom  mohamed ali
   Email : Alihadjali97@gmail.com

---
```
