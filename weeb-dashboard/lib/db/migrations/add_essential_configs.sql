-- Migration: Adicionar essential_configs e remover colunas específicas de plugins
-- Data: 2024-01-XX

-- Adicionar coluna essential_configs
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS essential_configs JSONB NOT NULL DEFAULT '{}';

-- Migrar dados existentes (se houver)
-- lastfm_username → essential_configs.lastfm.apiKey (se houver username, precisa ser convertido manualmente)
-- myanimelist_username → pode ser mantido ou migrado conforme necessário

-- Remover colunas específicas de plugins (após migração manual se necessário)
-- ALTER TABLE profiles DROP COLUMN IF EXISTS lastfm_username;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS myanimelist_username;

-- Criar índice para queries em essential_configs (opcional, mas útil)
CREATE INDEX IF NOT EXISTS idx_profiles_essential_configs ON profiles USING GIN (essential_configs);

