// frontend/src/App.js
import React, { useState } from 'react'; // Importez useState
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import ProjectList from './pages/ProjectList'; // Adjust path if needed
import CreateProjectForm from './components/CreateProjectForm';
import LoginForm from './components/LoginForm';
import ProjectDetail from './components/ProjectDetail';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

import AssistantChat from './components/AssistantChat'; // Importez le nouveau composant
import './App.css'; // Votre CSS global pour App
import './FloatingChatButton.css'; // Nouveau fichier CSS pour le bouton flottant et le chat


// La configuration d'ApolloClient a été déplacée dans src/index.js
// Vous pouvez supprimer les imports et la configuration de ApolloClient de ce fichier App.js

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [showChat, setShowChat] = useState(false); // État pour contrôler la visibilité du chat

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />} // Set LandingPage as the home route
        />
        <Route
          path="/projects"
          element={<ProjectList key={location.pathname} />}
        />
        <Route path="/create-project" element={<CreateProjectForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>

      {/* Bouton flottant pour ouvrir le chat */}
      <button
        className="floating-chat-button"
        onClick={toggleChat}
        aria-label="Ouvrir l'assistant chat"
      >
        {showChat ? (
          <span className="close-icon">&times;</span> // Icône de fermeture
        ) : (
          <span className="chat-icon">💬</span> // Icône de chat
        )}
      </button>

      {/* Interface de chat conditionnelle */}
      {showChat && (
        <div className="chat-modal-overlay"> {/* Overlay pour assombrir l'arrière-plan */}
          <div className="chat-modal-content">
            <AssistantChat />
          </div>
        </div>
      )}
    </>
  );
}

export default App;