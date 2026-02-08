require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id BIGSERIAL PRIMARY KEY,
        nom TEXT NOT NULL,
        email TEXT NOT NULL,
        telephone TEXT NOT NULL,
        etablissement TEXT,
        type TEXT NOT NULL CHECK (type IN ('restaurateur', 'apporteur')),
        message TEXT,
        status TEXT NOT NULL DEFAULT 'nouveau',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE contacts ADD CONSTRAINT email_format
          CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);
    await pool.query(`
      DO $$ BEGIN
        ALTER TABLE contacts ADD CONSTRAINT phone_format
          CHECK (telephone ~ '^0[1-9][0-9]{8}$');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)`);
    console.log('Migration OK: contacts table ready');
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

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
    console.error('Insert error:', err.message, err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

migrate().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});
