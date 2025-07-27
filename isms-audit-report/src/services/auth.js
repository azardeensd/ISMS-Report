import { jwtDecode } from 'jwt-decode';

// Authentication functions
export const login = async (credentials) => {
  localStorage.setItem('token', 'dummy-token');
  return { success: true };
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getAuthToken = () => localStorage.getItem('token');

export const getUserRole = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log('Full decoded token:', decoded); // Debug
    return decoded.role; // Now should be defined
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

export const isAdmin = () => ['Admin', 'SuperAdmin'].includes(getUserRole());
export const isSuperAdmin = () => getUserRole() === 'SuperAdmin';