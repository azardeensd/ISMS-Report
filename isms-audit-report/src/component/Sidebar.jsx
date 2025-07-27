import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      backgroundColor: '#f4f4f4',
      padding: '1rem',
      height: '100vh'
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '1rem' }}><Link to="/">Dashboard</Link></li>
        <li style={{ marginBottom: '1rem' }}><Link to="/audits">Audits</Link></li>
        <li style={{ marginBottom: '1rem' }}><Link to="/findings">Findings</Link></li>
        <li style={{ marginBottom: '1rem' }}><Link to="/reports">Reports</Link></li>
        <li style={{ marginBottom: '1rem' }}><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;