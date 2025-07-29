import React from 'react';
import { Outlet } from 'react-router-dom';
export default function AdminLayout() {
  return (
    <div>
      <h2>Admin Area</h2>
      <Outlet />
    </div>
  );
}