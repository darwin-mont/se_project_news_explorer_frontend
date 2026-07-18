// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // Redirect to home page if not logged in
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
