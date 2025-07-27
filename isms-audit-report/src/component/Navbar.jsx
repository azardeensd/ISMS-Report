import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  AuditOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined
} from '@ant-design/icons';
import { isAdmin, isSuperAdmin, logout } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/audits',
      icon: <AuditOutlined />,
      label: <Link to="/audits">Audits</Link>,
    },
    ...(isAdmin() ? [{
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">User Management</Link>,
    }] : []),
    ...(isSuperAdmin() ? [{
      key: '/admin/system',
      icon: <LockOutlined />,
      label: <Link to="/admin/system">System Settings</Link>,
      children: [
        {
          key: '/admin/system/config',
          label: <Link to="/admin/system/config">Configuration</Link>,
        },
        {
          key: '/admin/system/logs',
          label: <Link to="/admin/system/logs">Audit Logs</Link>,
        }
      ]
    }] : []),
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#2768F5',
      color: 'white'
    }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        ISMS Audit Report
      </span>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0, background: 'transparent' }}
      />
      <Button
        onClick={handleLogout}
        style={{
          marginLeft: '1rem',
          background: 'white',
          color: '#2768F5',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;