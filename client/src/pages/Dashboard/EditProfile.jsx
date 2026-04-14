// src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import './EditProfile.css';

const EditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    address: '',
    qualification: '',
    collegeOrCompany: '',
    experience: '',
    achievements: '',
    bio: '',
    profilePhoto: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: storedUser.name || '',
      email: storedUser.email || ''
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    localStorage.setItem('user', JSON.stringify(formData));
    alert('Profile saved!');
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="step-tabs">
        <div className={step === 1 ? 'tab active' : 'tab'} onClick={() => setStep(1)}>1. Personal Info</div>
        <div className={step === 2 ? 'tab active' : 'tab'} onClick={() => setStep(2)}>2. Education</div>
        <div className={step === 3 ? 'tab active' : 'tab'} onClick={() => setStep(3)}>3. Other Info</div>
      </div>

      <form className="edit-form" onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-section">
            <div className="form-row">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <div className="form-row">
              <label>Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>College/Company</label>
              <input type="text" name="collegeOrCompany" value={formData.collegeOrCompany} onChange={handleChange} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <div className="form-row">
              <label>Past Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Achievements</label>
              <input type="text" name="achievements" value={formData.achievements} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
            </div>
            <div className="form-row">
              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" onChange={handleChange} />
            </div>
          </div>
        )}

        <div className="form-footer">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button type="submit">Save Changes</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;