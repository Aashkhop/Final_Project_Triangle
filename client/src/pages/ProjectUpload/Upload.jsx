import React, { useState } from "react";
import "./Upload.css";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    techStack: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    console.log("Form Data:", formData);
    // proceed to next step
  };

  return (
    <div className="upload-page">
      {/* Sidebar */}
      <aside className="upload-sidebar">
        <div className="stepper-bar">
          <div className="step-item active">
            <div className="step-circle">1</div>
            <div className="step-label">Overview</div>
          </div>
          <div className="step-item">
            <div className="step-circle">2</div>
            <div className="step-label">Project Files</div>
          </div>
          <div className="step-item">
            <div className="step-circle">3</div>
            <div className="step-label">Marketing</div>
          </div>
          <div className="step-item">
            <div className="step-circle">4</div>
            <div className="step-label">Pricing</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="upload-main">
        <div className="upload-grid">
          {/* Form Card */}
          <div className="form-card">
            <h2 className="section-title">Project Overview</h2>
            <p className="section-subtitle">
              Tell us what your project is about. This helps attract the right audience.
            </p>

            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="E.g. AI Resume Analyzer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                placeholder="One-line pitch for your project"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tech Stack</label>
              <input
                type="text"
                name="techStack"
                placeholder="E.g. React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Data Analytics">Data Analytics</option>
              </select>
            </div>

            <div className="form-footer">
              <button className="next-btn" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="preview-card">
            <h3>{formData.title || "Your Project Title"}</h3>
            <p className="preview-tagline">{formData.tagline || "One-line pitch goes here"}</p>

            <div className="preview-details">
              <p>
                <strong>🛠 Tech Stack:</strong>{" "}
                {formData.techStack || <span style={{ color: "#999" }}>Not specified</span>}
              </p>
              <p>
                <strong>📂 Category:</strong>{" "}
                {formData.category || <span style={{ color: "#999" }}>Not selected</span>}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;