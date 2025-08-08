-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables
CREATE TABLE IF NOT EXISTS ngos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  tenant_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name_enc text NOT NULL,
  email_enc text NOT NULL,
  phone_enc text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT volunteer_tenant_unique UNIQUE (volunteer_id, tenant_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  volunteer_id uuid NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_ngos ON ngos;
CREATE TRIGGER trg_update_ngos BEFORE UPDATE ON ngos FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_update_volunteers ON volunteers;
CREATE TRIGGER trg_update_volunteers BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: per-tenant isolation via current_setting('app.tenant_id')
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY ngo_isolation ON ngos
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY membership_isolation ON volunteer_memberships
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY opportunity_isolation ON opportunities
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE POLICY application_isolation ON applications
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Volunteers visible only if membership exists for tenant
CREATE POLICY volunteer_visibility ON volunteers
  USING (EXISTS (
    SELECT 1 FROM volunteer_memberships m
    WHERE m.volunteer_id = id AND m.tenant_id = current_setting('app.tenant_id', true)::uuid
  ));

-- Seed sample NGOs
INSERT INTO ngos (id, name, tenant_id) VALUES
  (uuid_generate_v4(), 'Helping Hands', NULL),
  (uuid_generate_v4(), 'Green Earth', NULL)
ON CONFLICT DO NOTHING;

-- Set tenant_id to id for seeded NGOs
UPDATE ngos SET tenant_id = id WHERE tenant_id IS NULL;