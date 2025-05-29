
# Fundo

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20.svg?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-green.svg?style=for-the-badge&logo=django-rest-framework)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Table des matières

1.  [Introduction](#1-introduction)
2.  [Fonctionnalités](#2-fonctionnalités)
3.  [Technologies Utilisées](#3-technologies-utilisées)
4.  [Configuration du Projet](#4-configuration-du-projet)
    * [Prérequis](#prérequis)
    * [Backend (Django)](#backend-django)
    * [Frontend (React)](#frontend-react)
5.  [Utilisation](#5-utilisation)
6.  [Structure du Projet](#6-structure-du-projet)
7.  [API Endpoints](#7-api-endpoints)
8.  [Licence](#8-licence)
9.  [Contact](#9-contact)

---

## 1. Introduction

**Fundo** est une plateforme de financement participatif (crowdfunding) moderne et robuste, conçue pour connecter les créateurs de projets avec des donateurs potentiels. Que vous soyez un artiste, un innovateur, une organisation à but non lucratif ou un entrepreneur, Fundo offre les outils nécessaires pour lancer, gérer et financer vos initiatives.

La plateforme est construite avec une architecture découplée, utilisant Django REST Framework pour le backend API et React.js pour une interface utilisateur réactive et intuitive.

---

## 2. Fonctionnalités

* **Gestion des Utilisateurs :** Inscription, connexion, gestion de profil.
* **Projets :** Création, consultation, modification et suppression de projets de financement participatif.
* **Catégories :** Organisation des projets par catégories (par exemple, Technologie, Art, Communauté).
* **Donations :** Système de donation pour soutenir les projets.
* **Commentaires :** Possibilité pour les utilisateurs de commenter les projets.
* **Authentification JWT :** Accès sécurisé aux API via des jetons JWT.
* **Téléchargement d'Images :** Prise en charge des images de projet.

---

## 3. Technologies Utilisées

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

## 4. Configuration du Projet

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

## 5. Utilisation

Une fois le backend et le frontend lancés :

1.  **Accéder à l'application :** Ouvrez `http://localhost:3000/` dans votre navigateur.
2.  **Inscription :** Cliquez sur "Register" pour créer un nouveau compte utilisateur.
3.  **Connexion :** Utilisez votre nom d'utilisateur et mot de passe pour vous connecter via la page "Login".
4.  **Découvrir les Projets :** Parcourez la liste des projets existants sur la page d'accueil ou la page "Discover Projects".
5.  **Créer un Projet :** Une fois connecté, vous pouvez créer votre propre projet de financement participatif via la page "Create Project".
6.  **Détails du Projet :** Cliquez sur un projet pour voir ses détails, y compris la description, l'objectif de financement, les dates, les dons et les commentaires.
7.  **Administration (Backend) :** Accédez à l'interface d'administration Django via `http://127.0.0.1:8000/admin/` pour gérer les utilisateurs, les projets, les catégories, etc.

---

## 6. Structure du Projet

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

## 7. API Endpoints

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

## 8. Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 9. Contact

Pour toute question ou suggestion, n'hésitez pas à contacter :

   Nom  mohamed ali
   Email : Alihadjali97@gmail.com

---
```
