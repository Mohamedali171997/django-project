// frontend/src/pages/ProjectList.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // ← ADD THIS
import axios from '../axiosConfig';
import ProjectCard from '../components/ProjectCard';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation(); // ← CURRENT ROUTE LOCATION

  // Fetch projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('projects/');
      console.log("Projects API Response:", response.data);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on initial mount AND every time route location changes
  useEffect(() => {
    fetchProjects();
  }, [location]); // ← TRIGGER FETCH WHEN URL CHANGES

  if (loading) {
    return <div style={styles.container}>Loading projects...</div>;
  }

  if (error) {
    return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Discover Projects</h2>

      <div style={styles.projectGrid}>
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>No projects found. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  projectGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
};

export default ProjectList;
