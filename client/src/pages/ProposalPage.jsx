import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProposalPage.css';

const ProposalPage = () => {
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    expectedBudget: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Proposal submitted:', formData);
    alert('✅ Proposal submitted successfully!');
  };

  return (
    <div className="proposal-container">
      <h2>Submit Proposal for Project #{projectId}</h2>
      <form onSubmit={handleSubmit} className="proposal-form">
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Cover Letter / Message:</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedBudget">Expected Budget:</label>
          <input
            id="expectedBudget"
            name="expectedBudget"
            type="text"
            value={formData.expectedBudget}
            onChange={handleChange}
            placeholder="e.g. ₹3000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Attach File (optional):</label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-proposal-btn">
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default ProposalPage;