-- Migration: Remover colunas lastfm_username e myanimelist_username
-- Data: 2025-01-16
-- 
-- Essas colunas foram substituídas por essential_configs JSONB
-- Os dados devem estar migrados para essential_configs antes de executar esta migração

-- Remover colunas específicas de plugins
ALTER TABLE profiles DROP COLUMN IF EXISTS lastfm_username;
ALTER TABLE profiles DROP COLUMN IF EXISTS myanimelist_username;

