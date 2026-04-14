// src/pages/ProposalPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // Import your real user context

const CheckIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const ProposalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser(); // Get the logged-in user

  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_budget: '',
    attachment: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cover_letter) {
      setErrorMessage('Please write a cover letter.');
      return;
    }
    setSubmitting(true);
    setErrorMessage('');

    const submissionData = new FormData();
    submissionData.append('cover_letter', formData.cover_letter);
    submissionData.append('proposed_budget', formData.proposed_budget);
    if (formData.attachment) {
        submissionData.append('attachment', formData.attachment);
    }
    // No need to send name, backend gets it from the auth token

    try {
        await axios.post(`/api/proposals/${projectId}`, submissionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        setShowSuccessToast(true);
        setTimeout(() => {
            navigate(-1); // Go back to the previous page
        }, 2500);

    } catch (err) {
        const errorText = err.response?.data?.error || 'Failed to submit proposal.';
        setErrorMessage(errorText);
    } finally {
        setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center py-8 px-6 relative">

      {showSuccessToast && (
        <div className="fixed top-5 right-5 bg-teal-500 text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in-down">
          <CheckIcon />
          <p className="font-semibold">Proposal submitted successfully!</p>
        </div>
      )}

      <div className="w-full max-w-lg bg-gray-800 border border-teal-600/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-teal-400 mb-4">
          Submit Proposal for Project #{projectId}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Name:</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full bg-gray-700 text-gray-400 border border-gray-600 rounded-lg p-3 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-300 mb-2">Cover Letter / Message *</label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              rows="4"
              value={formData.cover_letter}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label htmlFor="proposed_budget" className="block text-sm font-medium text-gray-300 mb-2">Your Proposed Budget (₹)</label>
            <input
              id="proposed_budget"
              name="proposed_budget"
              type="number"
              value={formData.proposed_budget}
              onChange={handleChange}
              placeholder="e.g., 3000"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="attachment" className="block text-sm font-medium text-gray-300 mb-2">Attach File (optional):</label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              onChange={handleChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30 file:cursor-pointer transition"
            />
          </div>

          {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
            {submitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposalPage;