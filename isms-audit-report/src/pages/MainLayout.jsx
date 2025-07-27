import React from 'react';
import { Outlet } from 'react-router-dom';
export default function MainLayout() {
  return (
    <div>
      <h2>Main Area</h2>
      <Outlet />
    </div>
  );
}