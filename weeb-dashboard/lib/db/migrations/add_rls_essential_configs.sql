-- RLS Policies para essential_configs
-- O frontend não pode ler essentialConfigs diretamente do banco
-- A API route já filtra essentialConfigs antes de retornar ao frontend

-- Habilitar RLS na tabela profiles (se ainda não estiver habilitado)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ler apenas seu próprio perfil
-- (A API route filtra essentialConfigs antes de retornar)
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
USING (auth.uid()::text = user_id);

-- Policy: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Nota: A API route /api/profile GET remove essentialConfigs antes de retornar
-- A API route /api/profile PUT permite atualizar essentialConfigs (mesclando)
-- O backend (service_role) pode ler essentialConfigs para gerar SVGs

