import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../services/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const role = getUserRole();
  console.log('Current Role:', role); // DEBUG

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`Role ${role} not in`, allowedRoles); // DEBUG
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;