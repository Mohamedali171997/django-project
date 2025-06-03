import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Fonction pour lire le token CSRF dans les cookies
function getCSRFToken() {
  const match = document.cookie.match(/(^|;)\s*csrftoken=([^;]+)/);
  return match ? match[2] : null;
}

// 1. Créez un link d'authentification pour ajouter le JWT
const authLink = setContext((_, { headers }) => {
  // Récupérez le token JWT (par exemple, du localStorage)
  // Assurez-vous que la clé 'access_token' correspond à la façon dont vous stockez votre token après connexion
  const token = localStorage.getItem('access_token');
  const csrfToken = getCSRFToken();

  // Retournez les en-têtes au contexte de la requête
  return {
    headers: {
      ...headers, // Conserve les en-têtes existants
      authorization: token ? `Bearer ${token}` : '', // Ajoute l'en-tête Authorization avec le token JWT
      'X-CSRFToken': csrfToken || '', // Ajoute l'en-tête X-CSRFToken
    }
  };
});

// 2. Créez le HttpLink pour la connexion HTTP
const httpLink = new HttpLink({
  uri: '/graphql/', // L'URL de votre endpoint GraphQL
  credentials: 'include', // Indispensable pour envoyer les cookies (dont le csrftoken)
});

// 3. Combinez les links : authLink doit s'exécuter avant httpLink pour ajouter les en-têtes d'abord
const client = new ApolloClient({
  link: authLink.concat(httpLink), // La chaîne de links
  cache: new InMemoryCache(), // Le cache Apollo pour la gestion des données
});

export default client;