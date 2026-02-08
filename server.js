require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/contacts', async (req, res) => {
  const { nom, email, telephone, etablissement, type, message } = req.body;

  if (!nom || !email || !telephone || !type) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  if (!['restaurateur', 'apporteur'].includes(type)) {
    return res.status(400).json({ error: 'Type invalide' });
  }

  try {
    await pool.query(
      'INSERT INTO contacts (nom, email, telephone, etablissement, type, message) VALUES ($1, $2, $3, $4, $5, $6)',
      [nom, email, telephone, etablissement || null, type, message || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Insert error:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
