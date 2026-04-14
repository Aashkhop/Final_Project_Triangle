import React, { useState } from 'react';
import './Upload.css';
import UploadStepper from './UploadStepper';

function Upload() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="upload-page">
      {/* Left Sidebar */}
      <aside className="upload-sidebar">
        <UploadStepper currentStep={currentStep} />
      </aside>

      {/* Right Main Content */}
      <main className="upload-main">
        <div className="form-card">
          <h2 className="section-title">Project Overview</h2>

          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="E.g. AI-powered Resume Analyzer"
            />
          </div>

          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              placeholder="One-line summary to attract buyers"
            />
          </div>

          <div className="form-group">
            <label>Tech Stack</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select>
              <option>-- Select Category --</option>
              <option>Web Development</option>
              <option>AI/ML</option>
              <option>App Development</option>
              <option>Data Science</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-footer">
            <button className="next-btn" onClick={() => setCurrentStep(1)}>
              Next Step
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Upload;