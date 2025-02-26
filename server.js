const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const pool = require('./config');
const app = express();
const PORT = 3000;

// Multer setup remains the same
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(express.json());

// Create new patient record
app.post('/patients', async (req, res) => {
  try {
    const { id, name, age, contactDetails, medicalHistory } = req.body;
    const result = await pool.query(
      'INSERT INTO patients (id, name, age, contact_details, medical_history) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, age, contactDetails, medicalHistory]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve a patient record
app.get('/patients/:id', async (req, res) => {
  try {
    const patientResult = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [req.params.id]
    );
    
    if (patientResult.rows.length === 0) {
      return res.status(404).send('Patient not found');
    }

    const attachmentsResult = await pool.query(
      'SELECT filename, file_path FROM attachments WHERE patient_id = $1',
      [req.params.id]
    );

    const patient = {
      ...patientResult.rows[0],
      attachments: attachmentsResult.rows
    };
    
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search patients
app.get('/patients', async (req, res) => {
  try {
    const { name, medicalCondition } = req.query;
    let query = 'SELECT * FROM patients WHERE 1=1';
    const params = [];

    if (name) {
      params.push(`%${name}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    if (medicalCondition) {
      params.push(`%${medicalCondition}%`);
      query += ` AND medical_history ILIKE $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload attachment
app.post('/attachments', upload.single('attachment'), async (req, res) => {
  try {
    const { patientId } = req.body;
    
    // Check if patient exists
    const patientResult = await pool.query(
      'SELECT id FROM patients WHERE id = $1',
      [patientId]
    );
    
    if (patientResult.rows.length === 0) {
      return res.status(404).send('Patient not found');
    }

    const result = await pool.query(
      'INSERT INTO attachments (patient_id, filename, file_path) VALUES ($1, $2, $3) RETURNING *',
      [patientId, req.file.filename, req.file.path]
    );

    res.status(201).json({ 
      message: 'Attachment uploaded', 
      attachment: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
