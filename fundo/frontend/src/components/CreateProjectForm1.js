import React, { useState } from "react";
import axios from "axios";

const CreateProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("access"); // ✅ à l’extérieur, 1 seule fois

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Utilisateur non connecté. Veuillez vous connecter.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("goal_amount", goal);
    formData.append("deadline", deadline);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:8000/api/projects/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Projet créé !");
    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);
      alert("Erreur lors de la création.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un projet</h2>
      <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Montant objectif" value={goal} onChange={(e) => setGoal(e.target.value)} required />
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button type="submit">Créer</button>
    </form>
  );
};

export default CreateProjectForm;
