require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
app.use(express.json());
app.use(cors());
const upload = multer();

// SQL Server configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true // For local dev
  }
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Connect to SQL Server
    await sql.connect(config);
    
    // Check if user exists
    const userCheck = await sql.query`
      SELECT * FROM Users WHERE Username = ${username} OR Email = ${email}
    `;
    
    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await sql.query`
      INSERT INTO Users (Username, PasswordHash, Email)
      VALUES (${username}, ${hashedPassword}, ${email})
    `;

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    sql.close();
  }
});

// Login endpoint with role in JWT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Connect to SQL Server
    await sql.connect(config);

    // 1. Check user exists
    const result = await sql.query`
      SELECT * FROM Users WHERE Username = ${username}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.recordset[0];

    // 2. Verify password
    const validPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create token WITH role
    const token = jwt.sign(
      {
        userId: user.UserID,
        username: user.Username,
        role: user.Role // << MUST include this
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send token and role in response for debugging
    res.json({
      token,
      role: user.Role // Also send in response for debugging
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    sql.close();
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, async (req, res) => {
  try {
    await sql.connect(config);
    const user = await sql.query`
      SELECT Username, Email FROM Users WHERE UserId = ${req.userId}
    `;
    res.json({ message: 'Protected data', user: user.recordset[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  } finally {
    sql.close();
  }
});

// Middleware to authenticate token and attach user info
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach full user payload
    next();
  });
}

// Role-based middleware
function checkRole(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole === 'SuperAdmin') return next();
    if (userRole === requiredRole) return next();
    res.status(403).json({ message: 'Forbidden' });
  };
}

// Protected admin route example
app.get('/api/admin/users', 
  authenticateToken, 
  checkRole('Admin'),
  async (req, res) => {
    try {
      await sql.connect(config);
      const result = await sql.query`SELECT UserId, Username, Email, Role FROM Users`;
      res.json({ users: result.recordset });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    } finally {
      sql.close();
    }
  }
);

// Add new user by admin
app.post('/api/admin/users', async (req, res) => {
  let sqlConnection;
  try {
    console.log('Adding user:', req.body);
    const { UserID, Username, PasswordHash, Email, Role } = req.body;
    
    // Hash password if needed (recommended)
    // const hashedPassword = await bcrypt.hash(PasswordHash, 10);
    
    sqlConnection = await sql.connect(config);
    const result = await sqlConnection.query`
      INSERT INTO Users ( Username, PasswordHash, Email, Role)
      VALUES (${Username}, ${PasswordHash}, ${Email}, ${Role})
    `;
    
    res.status(201).json({ success: true, message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add user',
      error: err.message 
    });
  } finally {
    if (sqlConnection) {
      await sqlConnection.close();
    }
  }
});

// Import audit data from Excel
app.post('/audit/import', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Parse Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert each row into Audit_reports_1
    await sql.connect(config);
    let imported = 0;
    for (const row of data) {
      await sql.query`
        INSERT INTO Audit_reports_1 (date, auditor, findings, status)
        VALUES (${row.date}, ${row.auditor}, ${row.findings}, ${row.status})
      `;
      imported++;
    }

    res.json({ imported });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Import failed' });
  } finally {
    sql.close();
  }
});
app.post('/api/admin/users/import', async (req, res) => {
  let sqlConnection;
  try {
    const users = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    sqlConnection = await sql.connect(config);
    const transaction = new sql.Transaction(sqlConnection);
    await transaction.begin();

    try {
      let insertedCount = 0;
      for (const user of users) {
        const { UserID, Username, PasswordHash, Email, Role } = user;
        
        // Hash password if needed
        // const hashedPassword = await bcrypt.hash(PasswordHash, 10);
        
        await transaction.request().query`
          INSERT INTO Users (UserID, Username, PasswordHash, Email, Role)
          VALUES (${UserID}, ${Username}, ${PasswordHash}, ${Email}, ${Role})
        `;
        insertedCount++;
      }

      await transaction.commit();
      res.status(201).json({ 
        success: true, 
        insertedCount,
        message: 'Users imported successfully' 
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Error importing users:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import users',
      error: err.message 
    });
  } finally {
    if (sqlConnection) {
      await sqlConnection.close();
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));