INSERT INTO ngos (name) VALUES ('Helping Hands') ON CONFLICT DO NOTHING;
INSERT INTO ngos (name) VALUES ('Green Earth') ON CONFLICT DO NOTHING;
UPDATE ngos SET tenant_id = id WHERE tenant_id IS NULL;