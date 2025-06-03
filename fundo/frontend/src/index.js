// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Votre composant racine de l'application
import './index.css'; // Votre CSS global

// Importations d'Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// --- 1. Créez un lien HTTP pour pointer vers votre endpoint GraphQL Django ---
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include', // Assurez-vous que c'est l'URL correcte de votre API GraphQL Django
});

// --- 2. (Optionnel mais Recommandé) Ajoutez un lien pour l'authentification (si vous utilisez des tokens JWT) ---
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token'); // Assurez-vous que c'est là où vous stockez votre token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// --- 3. Créez le client Apollo ---
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// --- 4. Enveloppez votre application avec l'ApolloProvider ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App /> {/* Votre composant racine de l'application est enveloppé ici */}
    </ApolloProvider>
  </React.StrictMode>
);