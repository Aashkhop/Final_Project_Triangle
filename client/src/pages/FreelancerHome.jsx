import React from 'react';
import './FreelancerHome.css';
import { Link } from 'react-router-dom';

const FreelancerHome = () => {
  return (
    <div className="freelance-home">
      <h1>Welcome to the Freelance Hub</h1>
      <p className="subtext">Choose how you want to use the platform today.</p>

      <div className="freelance-options">
        <div className="card client">
          <h2>Post a Project</h2>
          <p>If you’re looking to hire someone to create your project, start here.</p>
          <Link to="/freelance/client">
            <button className="freelance-btn">I’m a Client</button>
          </Link>
        </div>

        <div className="card freelancer">
          <h2>Work on a Project</h2>
          <p>If you want to browse requests and start working, go here.</p>
          <Link to="/freelance/freelancer">
            <button className="freelance-btn">I’m a Freelancer</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancerHome;