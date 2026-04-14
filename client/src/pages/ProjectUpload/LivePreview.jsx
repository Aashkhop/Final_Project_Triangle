// LivePreview.jsx
import React from 'react';
import './Upload.css';

function LivePreview({ title, tagline, techStack, category }) {
  return (
    <div className="preview-card">
      <h3>{title || 'Your Project Title'}</h3>
      <p className="preview-tagline">{tagline || 'One-line pitch goes here'}</p>

      <div className="preview-details">
        <p><strong> Tech Stack:</strong> {techStack || 'Not specified'}</p>
        <p><strong> Category:</strong> {category || 'Not selected'}</p>
      </div>
    </div>
  );
}

export default LivePreview;