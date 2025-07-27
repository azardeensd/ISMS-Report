import React from 'react';
import AddUserForm from '../component/AddUserForm';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontStyle: 'italic' }}>
       User Management 
      </h2>
      <AddUserForm />
      {children}
    </div>
  );
};

export default AdminLayout;