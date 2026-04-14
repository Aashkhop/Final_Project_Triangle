// UploadStepper.jsx
import React from 'react';
import './Upload.css';

const steps = ['Overview', 'Uploads', 'Marketing', 'Pricing'];

function UploadStepper({ currentStep }) {
  return (
    <div className="stepper-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step-item ${index <= currentStep ? 'active' : ''}`}
        >
          <div className="step-circle">{index + 1}</div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

export default UploadStepper;