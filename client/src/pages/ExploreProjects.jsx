import React from 'react';
import { useProjects } from '../context/ProjectContext';
import './ExploreProjects.css';

const ExploreProjects = () => {
  const { projects } = useProjects();

  return (
    <div className="explore-container">
      <h2> Explore Uploaded Projects</h2>
      {projects.length === 0 ? (
        <p className="no-projects">No projects uploaded yet.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <h3>{project.title}</h3>
              <p><strong>Code Price:</strong> ₹{project.codePrice}</p>
              <p className="date">Uploaded: {new Date(project.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreProjects;