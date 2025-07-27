import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Audits from './pages/Audits';
import Reports from './pages/Reports';
import Login from './pages/Login';
import ProtectedRoute from './component/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import SuperAdminLayout from './Layout/SuperAdminLayout';
import AdminLayout from './Layout/AdminLayout';
import MainLayout from './Layout/MainLayout';
import SystemSettings from './pages/SystemSettings';
import ManageAdmins from './pages/ManageAdmins';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import Navbar from './component/Navbar';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Super Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
          <Route path="/super-admin/*" element={<SuperAdminLayout />}>
            <Route path="system-settings" element={<SystemSettings />} />
            <Route path="manage-admins" element={<ManageAdmins />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']} />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
          </Route>
        </Route>

        {/* Main Routes */}
        <Route element={<ProtectedRoute allowedRoles={['User', 'Admin', 'SuperAdmin']} />}>
          <Route path="/*" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="audits" element={<Audits />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>

        {/* Redirect any unknown paths to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;