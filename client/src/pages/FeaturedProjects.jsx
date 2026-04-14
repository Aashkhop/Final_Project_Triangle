import React from 'react';
import './FeaturedProjects.css';

function FeaturedProjects() {
  const projects = [
    { title: 'Chat App', abstract: 'Realtime chat app using Socket.io and Node.js', price: '₹249' },
    { title: 'E-Commerce App', abstract: 'Full MERN stack e-store with cart and payment', price: '₹399' },
    { title: 'ToDo List Pro', abstract: 'Task management app with drag-drop UI', price: '₹199' }
  ];

  return (
    <div className="projects-section">
      <h2>Top Rated Projects</h2>
      <div className="project-grid">
        {projects.map((proj, i) => (
          <div className="project-card" key={i}>
            <h3>{proj.title}</h3>
            <p>{proj.abstract}</p>
            <div className="card-bottom">
              <span>{proj.price}</span>
              <button>Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProjects;