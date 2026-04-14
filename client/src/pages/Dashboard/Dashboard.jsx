import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  return (
    <div className="dashboard-main-only">
      {/* Header + User Info Section */}
      <section className="header-user-section">
        <div className="user-info-card">
          <h2>{userName || 'User'}</h2>
          <p className="user-label">Profile</p>
          <button
            className="edit-profile-stat-btn"
            onClick={() => navigate('/profile/edit')}
          >
            ✎ Edit Profile
          </button>
        </div>

        <div className="header-card">
          <h1>Dashboard</h1>
          <p>Plan, track and accomplish your goals with ease.</p>
        </div>
      </section>

      {/* Grouped Stats - Two Horizontal Cards */}
      <section className="dashboard-stats-grouped">
        <div className="stat-wrapper-card">
          <div className="stat-card green">
            <h2>24</h2>
            <p>Total Projects</p>
          </div>
          <div className="stat-card blue">
            <h2>10</h2>
            <p>Ended Projects</p>
          </div>
        </div>

        <div className="stat-wrapper-card">
          <div className="stat-card purple">
            <h2>12</h2>
            <p>Running Projects</p>
          </div>
          <div className="stat-card orange">
            <h2>2</h2>
            <p>Pending Projects</p>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="dashboard-grid">
        <div className="progress-card">
          <h3>Project Progress</h3>
          <div className="progress-circle">
            <span>41%</span>
          </div>
        </div>

        <div className="meeting-card">
          <h3>Reminder</h3>
          <p>Meeting with Arc Company</p>
          <button>Start Meeting</button>
        </div>

        <div className="time-tracker">
          <h3>Time Tracker</h3>
          <div className="time-display">
            <span>01:24:08</span>
            <button className="pause-btn">⏸</button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h3>Team Collaboration</h3>
        <ul className="team-list">
          <li>👩‍💻 Amanpreet Kaur - Client</li>
          <li>👨‍🎨 Eshan Mhatre - UI/UX Designer</li>
          <li>👨‍💻 Sarthak Oza - Developer</li>
          <li>👩‍💼 Charvi Goyal - Manager</li>
        </ul>
      </section>

      {/* Project Board */}
      <section className="project-list">
        <h3>Project Board</h3>
        <ul>
          <li>✔ Donezo UI Redesign</li>
          <li>📈 Optimize Page Load</li>
          <li>🧪 Cross Browser Testing</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;