import React from 'react';
import { Outlet } from 'react-router-dom';
export default function SuperAdminLayout() {
  return (
    <div>
      <h2>Super Admin Area</h2>
      <Outlet />
    </div>
  );
}