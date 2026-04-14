// src/context/ProjectUploadContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectUploadContext = createContext();

// Custom hook
export const useProjectUpload = () => {
  const context = useContext(ProjectUploadContext);
  if (!context) {
    throw new Error("useProjectUpload must be used within ProjectUploadProvider");
  }
  return context;
};

// Provider component
export const ProjectUploadProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000/api/listings";

  // Fetch projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/explore`);
      if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload project
  const uploadProject = async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload project");

      // Add new project to state
      if (data && data.id) setProjects((prev) => [data, ...prev]);
      else await fetchProjects();

      return data;
    } catch (err) {
      console.error("Error uploading project:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectUploadContext.Provider
      value={{
        projects,
        loading,
        error,
        fetchProjects,
        uploadProject,
      }}
    >
      {children}
    </ProjectUploadContext.Provider>
  );
};
