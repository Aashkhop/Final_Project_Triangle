// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) {
    // You can add a spinner here
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;