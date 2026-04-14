import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create context
const ProjectContext = createContext();

// 2. Custom hook to use context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

// 3. Provider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    // Optional: Load from localStorage on initial render
    const stored = localStorage.getItem('projects');
    return stored ? JSON.parse(stored) : [];
  });

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  // Optional: Persist to localStorage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};