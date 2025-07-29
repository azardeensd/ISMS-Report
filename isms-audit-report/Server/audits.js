// routes/audits.js
const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');
const { verifyAdmin } = require('../middleware/auth');

router.post('/import', verifyAdmin, async (req, res) => {
  try {
    const { data, importedBy } = req.body;
    
    // Validate data structure
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Transform data if needed
    const auditsToImport = data.map(item => ({
      ...item,
      importedBy,
      importDate: new Date()
    }));

    // Insert to database
    const result = await Audit.insertMany(auditsToImport);

    res.json({
      success: true,
      insertedCount: result.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Import failed' });
  }
});

module.exports = router;