import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApex } from '../../context/ApexContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useApex();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase();
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
    // Logged in but insufficient permissions - redirect to role-specific dashboard
    if (userRole === 'PATIENT') return <Navigate to="/patient" replace />;
    if (userRole === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (userRole === 'BILLING_STAFF') return <Navigate to="/billing-admin" replace />;
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
