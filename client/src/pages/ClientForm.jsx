import React, { useState } from "react";
import "./ClientForm.css";
import { useNavigate } from "react-router-dom";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    file: null,
    skills: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // ✅ Hook to navigate programmatically

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("budget", formData.budget);
    form.append("deadline", formData.deadline);
    form.append("skills", formData.skills);
    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects/submit-project", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMsg("");
        setShowModal(true); // ✅ Show success modal
        setFormData({
          title: "",
          description: "",
          category: "",
          budget: "",
          deadline: "",
          file: null,
          skills: "",
        });
      } else {
        setErrorMsg(data.message || "❌ Failed to submit project.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg("❌ Error submitting form. Please try again.");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  return (
    <div className="client-form-page">
      <div className="client-form-body">
        <div className="client-form-card">
          <h2 className="section-title">Project Details</h2>

          {errorMsg && <p className="form-error">{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            <div className="client-form-grid">
              <div className="client-form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Mobile App Development"
                  required
                />
              </div>

              <div className="client-form-group">
                <label>Required Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js"
                  required
                />
              </div>

              <div className="client-form-group full-width">
                <label>Short Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe your project"
                  required
                />
              </div>

              <div className="client-form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="client-form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="design">UI/UX Design</option>
                  <option value="data">Data Science</option>
                </select>
              </div>

              <div className="client-form-group full-width">
                <label>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="$500 - $1000"
                  required
                />
              </div>

              <div className="client-form-group full-width">
                <label>Upload File (optional)</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="client-form-submit">
              <button type="submit" className="client-submit-btn">
                Submit Project
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>✅ Project Submitted!</h3>
            <p>Your project has been successfully uploaded.</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/freelance"); // ✅ Correct path from App.js
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForm;