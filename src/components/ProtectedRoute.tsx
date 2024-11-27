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

  // Redirect pharmacy staff to pharmacy dashboard
  if ((user.role === 'pharmacyStaff' || user.role === 'pharmacyAdmin') && !location.pathname.startsWith('/pharmacy')) {
    return <Navigate to="/pharmacy" replace />;
  }

  // Redirect delivery coordinator to coordinator dashboard
  if (user.role === 'deliveryCoordinator' && !location.pathname.startsWith('/coordinator')) {
    return <Navigate to="/coordinator" replace />;
  }

  // Prevent unauthorized access to role-specific routes
  if (location.pathname.startsWith('/doctor') && !['doctor', 'clinic'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  if (location.pathname.startsWith('/pharmacy') && !['pharmacyStaff', 'pharmacyAdmin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname.startsWith('/coordinator') && user.role !== 'deliveryCoordinator') {
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