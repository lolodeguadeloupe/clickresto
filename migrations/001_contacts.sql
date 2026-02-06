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
);

ALTER TABLE contacts ADD CONSTRAINT email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE contacts ADD CONSTRAINT phone_format
  CHECK (telephone ~ '^0[1-9][0-9]{8}$');

ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

GRANT INSERT ON contacts TO anon;

CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON contacts(status);
