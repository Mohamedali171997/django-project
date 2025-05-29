// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Import ProjectList from './pages/ProjectList' (if you have it there)
// or from './components/ProjectList' if that's where it resides.
// Assuming ProjectList is in pages based on your files.
import ProjectList from './pages/ProjectList'; // Adjust path if needed
import CreateProjectForm from './components/CreateProjectForm';
import LoginForm from './components/LoginForm';
import ProjectDetail from './components/ProjectDetail';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage'; // Import the new LandingPage

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

  return (
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
  );
}

export default App;