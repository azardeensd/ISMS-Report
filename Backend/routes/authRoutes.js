const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMiddleware');

// Mock user database (replace with your actual user database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In production, store hashed passwords
    roles: ['admin']
  }
];

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign(
    { 
      userId: user.id,
      username: user.username,
      roles: user.roles 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ 
    token,
    user: {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
  });
});

// Token verification route
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;