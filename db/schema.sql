-- Leads from the "Talk to us" form (Postgres, e.g. Neon).
-- Apply once:  psql "$DATABASE_URL" -f db/schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL DEFAULT '',
  vertical    TEXT NOT NULL DEFAULT '',
  erp         TEXT NOT NULL DEFAULT '',
  volume      TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL DEFAULT '',
  lang        TEXT NOT NULL DEFAULT 'he',
  page        TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at DESC);
