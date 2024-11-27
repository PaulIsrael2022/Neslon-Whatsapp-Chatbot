import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect doctors and clinics to their specific dashboard
  if ((user.role === 'doctor' || user.role === 'clinic') && !location.pathname.startsWith('/doctor')) {
    return <Navigate to="/doctor" replace />;
  }

  // Redirect other roles to main dashboard if they try to access doctor routes
  if (location.pathname.startsWith('/doctor') && !['doctor', 'clinic'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is empty, allow access to authenticated users
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}