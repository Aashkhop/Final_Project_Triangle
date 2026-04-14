import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // ✅ Hook from context

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ from context

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' }); // Clear message

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      login(res.data.user); // ✅ Set user context
      setMessage({ type: 'success', text: res.data.message });

      setTimeout(() => navigate('/'), 500); // Redirect after short delay
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log-in to Project Triangle</h2>

      {/* ✅ Message feedback */}
      {message.text && (
        <div className={`login-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="login-footer">
        Don't have an account? <Link to="/register">Register to get started.</Link>
      </div>
    </div>
  );
};

export default Login;