const RoleBasedComponent = ({ allowedRoles, children }) => {
  const userRole = getUserRole();
  
  if (!allowedRoles.includes(userRole)) {
    return null; // or <Unauthorized />
  }
  
  return children;
};

// Usage:
<RoleBasedComponent allowedRoles={['Admin', 'SuperAdmin']}>
  <Button onClick={deleteUser}>Delete User</Button>
</RoleBasedComponent>