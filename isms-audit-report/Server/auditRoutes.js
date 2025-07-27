const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const sql = require('mssql');

// Configure file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/import', 
  upload.single('excelFile'),
  async (req, res) => {
    try {
      // 1. Read Excel file
      const workbook = xlsx.read(req.file.buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      // 2. Connect to SQL Server
      await sql.connect(config);
      const transaction = new sql.Transaction();
      await transaction.begin();

      // 3. Process each row
      for (const row of data) {
        await new sql.Request(transaction)
          .input('auditDate', sql.Date, row.date)
          .input('auditor', sql.NVarChar, row.auditor)
          .input('findings', sql.NVarChar, row.findings)
          .input('status', sql.NVarChar, row.status)
          .query(`
            INSERT INTO Audit_reports_1 
            (audit_date, auditor_name, findings, status)
            VALUES 
            (@auditDate, @auditor, @findings, @status)
          `);
      }

      await transaction.commit();
      res.json({ success: true, imported: data.length });
    } catch (err) {
      await transaction.rollback();
      console.error('Import error:', err);
      res.status(500).json({ error: 'Import failed' });
    }
});