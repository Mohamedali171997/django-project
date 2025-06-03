// src/components/AssistantChat.js

import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import './AssistantChat.css'; // Créez ce fichier pour le style, si vous voulez

// Définissez votre mutation GraphQL
// Elle doit correspondre exactement à la mutation 'askGeminiAssistant' de votre backend
const ASK_GEMINI_ASSISTANT_MUTATION = gql`
  mutation AskGeminiAssistant($message: String!) {
    askGeminiAssistant(message: $message) {
      responseText
    }
  }
`;

function AssistantChat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Pour stocker les messages et réponses

  // useMutation hook: [executeMutation, { data, loading, error }]
  const [askAssistant, { loading, error }] = useMutation(ASK_GEMINI_ASSISTANT_MUTATION, {
    onCompleted: (data) => {
      // Quand la mutation est complète et réussie
      console.log("Mutation completed successfully:", data);
      const assistantResponse = data.askGeminiAssistant.responseText;
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'assistant', text: assistantResponse },
      ]);
    },
    onError: (mutationError) => {
      // Gérer les erreurs de mutation
      console.error("Erreur lors de l'envoi du message à l'assistant:", mutationError);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'error', text: `Erreur: ${mutationError.message}` },
      ]);
    },
  });

  const handleSendMessage = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page si c'est un formulaire

    if (message.trim() === '') {
      return; // Ne pas envoyer de message vide
    }

    // Ajoutez le message de l'utilisateur à l'historique
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'user', text: message.trim() },
    ]);

    try {
      // Exécutez la mutation GraphQL
      await askAssistant({ variables: { message: message.trim() } });
      setMessage(''); // Effacez le champ de saisie après l'envoi
    } catch (err) {
      // Les erreurs de réseau ou de GraphQL sont gérées par onError défini ci-dessus
      // Catcher ici n'est pas toujours nécessaire si onError est suffisant.
      console.log("Mutation catch block:", err);
    }
  };

  return (
    <div className="assistant-chat-container">
      <h3>Assistant Fundo IA</h3>
      <div className="chat-history">
        {chatHistory.length === 0 && <p className="welcome-message">Bonjour ! Comment puis-je vous aider avec Fundo aujourd'hui ?</p>}
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'user' ? 'Vous: ' : 'Assistant: '}
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-message assistant loading">Assistant: ... (réfléchit)</div>}
        {error && <div className="chat-message error">Erreur: {error.message}</div>}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tapez votre message ici..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default AssistantChat;