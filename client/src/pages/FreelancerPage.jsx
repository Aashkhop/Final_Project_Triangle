// client/src/pages/FreelancerPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './FreelancerPage.css';

const FreelancerPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="freelancer-page">
      <h1>Available Projects</h1>
      <p className="subtitle">Browse and send proposals to clients who need your skills.</p>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="no-projects">No projects available at the moment.</p>
      ) : (
        <div className="project-list">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{ '--animation-order': index }}
            >
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <span className="budget">Budget: {project.budget}</span>
              <p><strong>Tech Need:</strong> {project.skills}</p>
              <p><strong>Category:</strong> {project.category}</p>
              <p><strong>Deadline:</strong> {project.deadline}</p>
              {project.fileUrl && (
                <a
                  href={`http://localhost:5000${project.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", marginTop: "0.5rem" }}
                >
                  📎 View Attachment
                </a>
              )}
              <Link to={`/proposal/${project.id}`}>
                <button className="apply-btn">Send Proposal</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerPage;